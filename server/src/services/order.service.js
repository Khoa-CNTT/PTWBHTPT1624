"use strict"; // Bật chế độ strict mode để bắt lỗi cú pháp và hành vi không an toàn trong JavaScript

// Nhập các lớp lỗi tùy chỉnh và các mô hình dữ liệu từ các file khác
const { BadRequestError, NotFoundError } = require("../core/error.response");
const Order = require("../models/order.model"); // Mô hình đơn hàng
const Product = require("../models/product.model"); // Mô hình sản phẩm
const Voucher = require("../models/voucher.model"); // Mô hình mã giảm giá
const Cart = require("../models/cart.model"); // Mô hình giỏ hàng
const { convertToObjectIdMongodb } = require("../utils"); // Hàm tiện ích chuyển đổi ID sang định dạng ObjectId của MongoDB
const userVoucherModel = require("../models/userVoucher.model");
const shippingCompany = require("../models/shippingCompany.model");
const { default: mongoose } = require("mongoose");

class OrderService {
  // Hàm tạo đơn hàng mới, nhận payload chứa thông tin đơn hàng
  static async createOrder(payload) {
    const {
      userId, // ID của người dùng đặt hàng
      order_shipping_company, // ID công ty vận chuyển
      order_shipping_address, // Địa chỉ giao hàng
      order_payment_method, // Phương thức thanh toán
      order_voucherId, // ID mã giảm giá (nếu có)
      order_products // Danh sách sản phẩm trong đơn hàng
    } = payload;
    // Bước 1: Kiểm tra sản phẩm
    // Kiểm tra tất cả sản phẩm trong danh sách order_products bằng Promise
    const productChecks = await Promise.all(
      order_products.map(async (item) => {
        const product = await Product.findById(item.productId); // Tìm sản phẩm trong DB theo ID
        if (!product) throw new NotFoundError("Không tìm thấy sản phẩm"); // Nếu không tìm thấy, báo lỗi
        return {
          name: product.product_name, // Tên sản phẩm
          available: product.product_quantity >= item.quantity // Kiểm tra số lượng đủ hay không
        };
      })
    );
    // Lọc ra các sản phẩm hết hàng
    const outOfStockProducts = productChecks
      .filter((check) => !check.available) // Lấy các sản phẩm không đủ số lượng
      .map((check) => check.name); // Lấy tên của các sản phẩm đó
    // Kiểm tra nếu có sản phẩm hết hàng thì báo lỗi với danh sách tên
    if (outOfStockProducts.length > 0) {
      throw new BadRequestError(
        `Các sản phẩm đã hết hàng: ${outOfStockProducts.join(", ")}`
      ); // Báo lỗi với danh sách sản phẩm hết hàng
    }
    // Bước 2: Tính giá sản phẩm
    let totalPrice = 0; // Khởi tạo tổng giá trị đơn hàng
    const productsToOrder = await Promise.all(
      order_products.map(async (item) => {
        const product = await Product.findById(item.productId); // Lấy thông tin sản phẩm
        // Tính giá sau khi áp dụng giảm giá (nếu có)
        const priceAfterDiscount = (product.product_price * (100 - product.product_discount)) / 100;
        totalPrice += priceAfterDiscount * item.quantity; // Cộng dồn vào tổng giá trị
        return {
          productId: product._id, // ID sản phẩm
          price: priceAfterDiscount, // Giá sau giảm
          quantity: item.quantity, // Số lượng đặt mua
        };
      })
    );
    // Bước 3: Xử lý mã giảm giá (nếu có)
    if (order_voucherId) {
      // Kiểm tra xem user đã sở hữu voucher chưa
      const userVoucher = await userVoucherModel.findOne({
        vc_user_id: userId,
        vc_vouchers: { $in: [order_voucherId] }
      });
      // Tìm mã giảm giá trong DB
      const voucher = await Voucher.findById(order_voucherId);
      if (!voucher) { throw new NotFoundError("Không tìm thấy voucher"); }
      // Kiểm tra xem user đã sử dụng voucher này chưa
      const hasUserUsedVoucher = voucher.voucher_users_used.some(
        userUsedId => userUsedId.toString() === userId.toString()
      );
      if (hasUserUsedVoucher) {
        throw new BadRequestError("Bạn đã đạt giới hạn số lần sử dụng voucher này");
      }
      if (voucher.voucher_method === "percent") { // Nếu giảm giá theo phần trăm
        const discount = (totalPrice * voucher.voucher_value) / 100; // Tính số tiền giảm
        // Áp dụng giảm giá, nhưng không vượt quá giá trị tối đa của voucher
        totalPrice -= Math.min(discount, voucher.voucher_max_price);
      } else { // Nếu giảm giá theo số tiền cố định
        totalPrice -= voucher.voucher_value; // Trừ trực tiếp giá trị voucher
      }
    }
    // Bước 4: Thêm phí vận chuyển
    const shipping = await shippingCompany.findById(order_shipping_company); // Tìm công ty vận chuyển
    if (!shipping) throw new NotFoundError("Không tìm thấy công ty vận chuyển"); // Nếu không tìm thấy, báo lỗi
    const shippingPrice = shipping.sc_shipping_price || 0; // Lấy phí vận chuyển, mặc định là 0 nếu không có
    totalPrice += shippingPrice; // Cộng phí vận chuyển vào tổng giá
    // Bước 5: Tạo đơn hàng và cập nhật dữ liệu
    const session = await mongoose.startSession(); // Bắt đầu một phiên giao dịch với MongoDB
    session.startTransaction(); // Bắt đầu giao dịch để đảm bảo tính toàn vẹn dữ liệu
    try {
      // Cập nhật số lượng sản phẩm trong kho
      await Promise.all(
        order_products.map(item =>
          Product.findByIdAndUpdate(
            item.productId,
            {
              $inc: {
                product_quantity: -item.quantity, // Giảm số lượng tồn kho
                product_sold: item.quantity // Tăng số lượng đã bán
              }
            },
            { session } // Đảm bảo tính toàn vẹn dữ liệu
          )
        )
      );
      // Tạo đơn hàng mới trong DB
      const newOrder = await Order.create({
        order_user: userId, // Người đặt hàng
        order_products: productsToOrder, // Danh sách sản phẩm
        order_voucher: order_voucherId, // Mã giảm giá (nếu có)
        order_total_price: totalPrice, // Tổng giá trị đơn hàng
        order_payment_method, // Phương thức thanh toán
        order_shipping_address, // Địa chỉ giao hàng
        order_shipping_price: shippingPrice, // Phí vận chuyển
        order_shipping_company, // Công ty vận chuyển
      });
      // Cập nhật thông tin mã giảm giá (nếu có)
      if (order_voucherId) {
        await Voucher.findByIdAndUpdate(
          order_voucherId,
          { $push: { voucher_users_used: userId } } // Thêm userId vào danh sách người đã dùng voucher
        );
      }
      // Xóa sản phẩm khỏi giỏ hàng của người dùng
      await Cart.findOneAndUpdate(
        { cart_user: userId }, // Tìm giỏ hàng của người dùng
        {
          $pull: {
            cart_products: {
              productId: { $in: order_products.map(item => item.productId) } // Xóa các sản phẩm đã đặt
            }
          }
        }
      );
      await session.commitTransaction(); // Xác nhận giao dịch thành công
      return {
        message: "Đặt hàng thành công", // Thông báo thành công
        orderId: newOrder._id, // ID đơn hàng vừa tạo
        totalPrice // Tổng giá trị đơn hàng
      };
    } catch (error) {
      await session.abortTransaction(); // Hủy giao dịch nếu có lỗi
      throw error; // Ném lỗi ra ngoài để xử lý
    } finally {
      session.endSession(); // Kết thúc phiên giao dịch
    }
  }
}

module.exports = OrderService; // Xuất lớp OrderService để sử dụng ở nơi khác