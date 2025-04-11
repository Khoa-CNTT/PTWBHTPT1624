'use strict';
const { BadRequestError, NotFoundError } = require('../core/error.response');
const Product = require('../models/product.model'); // Mô hình sản phẩm
const Voucher = require('../models/voucher.model'); // Mô hình mã giảm giá
const Cart = require('../models/cart.model'); // Mô hình giỏ hàng
const userVoucherModel = require('../models/userVoucher.model');
const shippingCompany = require('../models/shippingCompany.model');
const { default: mongoose } = require('mongoose');
const PurchasedModel = require('../models/Purchased.model');
const OnlineOrder = require('../models/OnlineOrder');
const OfflineOrder = require('../models/OfflineOrder');

class OrderService {
    static async createOfflineOrder(payload) {
        const {
            adminId, // ID của người dùng đặt hàng
            order_payment_method, // Phương thức thanh toán
            order_voucherId, // ID mã giảm giá (nếu có)
            order_products, // Danh sách sản phẩm trong đơn hàng
        } = payload;
        // Bước 1: Kiểm tra sản phẩm
        // Kiểm tra tất cả sản phẩm trong danh sách order_products
        const productChecks = await Promise.all(
            order_products.map(async (item) => {
                const product = await Product.findById(item.productId); // Tìm sản phẩm trong DB theo ID
                if (!product) throw new NotFoundError('Không tìm thấy sản phẩm'); // Nếu không tìm thấy, báo lỗi
                return {
                    name: product.product_name, // Tên sản phẩm
                    available: product.product_quantity >= item.quantity, // Kiểm tra số lượng đủ hay không
                };
            }),
        );
        // Lọc ra các sản phẩm hết hàng
        const outOfStockProducts = productChecks
            .filter((check) => !check.available) // Lấy các sản phẩm không đủ số lượng
            .map((check) => check.name); // Lấy tên của các sản phẩm đó
        // Kiểm tra nếu có sản phẩm hết hàng thì báo lỗi với danh sách tên
        if (outOfStockProducts.length > 0) {
            throw new BadRequestError(`Các sản phẩm đã hết hàng: ${outOfStockProducts.join(', ')}`); // Báo lỗi với danh sách sản phẩm hết hàng
        }
        // Bước 2: Tính tổng tiền đơn hàng và bổ sung thông tin product list
        let totalPrice = 0;
        let totalApplyDiscount = 0;
        const productsToOrder = await Promise.all(
            order_products.map(async (item) => {
                const product = await Product.findById(item.productId); // Lấy thông tin sản phẩm
                // Tính giá sau khi áp dụng giảm giá (nếu có)
                totalApplyDiscount += (product.product_price * (100 - (product.product_discount || 0))) / 100;
                totalPrice += product.product_price * item.quantity; // Cộng dồn vào tổng giá trị
                return {
                    productId: product._id, // ID sản phẩm
                    price: product.product_price, // Giá gốc
                    quantity: item.quantity, // Số lượng đặt mua
                    discount: product.product_discount,
                };
            }),
        );
        // Bước 3: Xử lý mã giảm giá (nếu có)
        if (order_voucherId) {
            // Kiểm tra xem user đã sở hữu voucher chưa
            const userVoucher = await userVoucherModel.findOne({
                vc_user_id: userId,
                vc_vouchers: { $in: [order_voucherId] },
            });
            if (!userVoucher) {
                throw new NotFoundError('Bạn không sở hữu voucher này');
            }
            // Tìm mã giảm giá trong DB
            const voucher = await Voucher.findById(order_voucherId);
            if (!voucher) {
                throw new NotFoundError('Không tìm thấy voucher');
            }
            // Giá trị đơn hàng tối thiểu để áp dụng voucher
            if (totalPrice < voucher.voucher_min_order_value) {
                throw new BadRequestError(`Giá trị đơn hàng tối thiểu ${voucher.voucher_min_order_value}`);
            }
            if (voucher.voucher_method === 'percent') {
                // Nếu giảm giá theo phần trăm
                const discount = (totalPrice * voucher.voucher_value) / 100; // Tính số tiền giảm
                // Áp dụng giảm giá, nhưng không vượt quá giá trị tối đa của voucher
                totalApplyDiscount += Math.min(discount, voucher.voucher_max_price || Infinity);
            } else {
                // Nếu giảm giá theo số tiền cố định
                totalApplyDiscount += voucher.voucher_value; //
            }
        }
        const newOrder = await OfflineOrder.create([
            {
                order_staff: adminId,
                order_products: productsToOrder, // Danh sách sản phẩm
                order_voucher: order_voucherId, // Mã giảm giá (nếu có)
                order_total_price: totalPrice, // Tổng giá trị đơn hàng
                order_total_apply_discount: totalApplyDiscount, // tổng discount
                order_payment_method, // Phương thức thanh toán
            },
        ]);
        if (newOrder) {
            // Cập nhật số lượng sản phẩm trong kho
            await Promise.all(
                order_products.map((item) =>
                    Product.findByIdAndUpdate(item.productId, {
                        $inc: {
                            product_quantity: -item.quantity, // Giảm số lượng tồn kho
                            product_sold: item.quantity, // Tăng số lượng đã bán
                        },
                    }),
                ),
            );
        }
        return newOrder;
    }
    static async getAllOrdersOffline({ limit = 10, page = 0 }) {
        const limitNum = parseInt(limit, 10); // Mặc định limit = 10
        const pageNum = parseInt(page, 10); // Mặc định page = 0
        const skipNum = pageNum * limitNum;
        const orders = await OfflineOrder.find()
            .select('order_code order_payment_method order_total_price order_products createdAt') // chọn thêm createdAt nếu cần
            .populate([
                {
                    path: 'order_products.productId',
                    select: 'product_name',
                },
                {
                    path: 'order_staff',
                    select: 'admin_name admin_mobile',
                },
            ])
            .sort({ createdAt: -1 }) // 🔥 Sắp xếp mới nhất trước
            .skip(skipNum)
            .limit(limitNum)
            .lean();
        const totalOrders = await OfflineOrder.countDocuments();
        return {
            totalPage: Math.ceil(totalOrders / limitNum) - 1, // Tổng số trang (0-based)
            currentPage: pageNum,
            totalOrders,
            orders,
        };
    }

    // Hàm tạo đơn hàng mới, nhận payload chứa thông tin đơn hàng
    static async createOrder(payload) {
        const {
            userId, // ID của người dùng đặt hàng
            order_shipping_company, // ID công ty vận chuyển
            order_shipping_address, // Địa chỉ giao hàng
            order_payment_method, // Phương thức thanh toán
            order_voucherId, // ID mã giảm giá (nếu có)
            order_products, // Danh sách sản phẩm trong đơn hàng
        } = payload;
        // Bước 1: Kiểm tra sản phẩm
        // Kiểm tra tất cả sản phẩm trong danh sách order_products
        const productChecks = await Promise.all(
            order_products.map(async (item) => {
                const product = await Product.findById(item.productId); // Tìm sản phẩm trong DB theo ID
                if (!product) throw new NotFoundError('Không tìm thấy sản phẩm'); // Nếu không tìm thấy, báo lỗi
                return {
                    name: product.product_name, // Tên sản phẩm
                    available: product.product_quantity >= item.quantity, // Kiểm tra số lượng đủ hay không
                };
            }),
        );

        // Lọc ra các sản phẩm hết hàng
        const outOfStockProducts = productChecks
            .filter((check) => !check.available) // Lấy các sản phẩm không đủ số lượng
            .map((check) => check.name); // Lấy tên của các sản phẩm đó
        // Kiểm tra nếu có sản phẩm hết hàng thì báo lỗi với danh sách tên
        if (outOfStockProducts.length > 0) {
            throw new BadRequestError(`Các sản phẩm đã hết hàng: ${outOfStockProducts.join(', ')}`); // Báo lỗi với danh sách sản phẩm hết hàng
        }
        // Bước 2: Tính tổng tiền đơn hàng và bổ sung thông tin product list
        let totalPrice = 0;
        let totalApplyDiscount = 0;
        const productsToOrder = await Promise.all(
            order_products.map(async (item) => {
                const product = await Product.findById(item.productId); // Lấy thông tin sản phẩm
                // Tính giá sau khi áp dụng giảm giá (nếu có)
                totalApplyDiscount += (product.product_price * (100 - (product.product_discount || 0))) / 100;
                totalPrice += product.product_price * item.quantity; // Cộng dồn vào tổng giá trị
                return {
                    productId: product._id, // ID sản phẩm
                    price: product.product_price, // Giá gốc
                    quantity: item.quantity, // Số lượng đặt mua
                    discount: product.product_discount,
                };
            }),
        );
        // Bước 3: Xử lý mã giảm giá (nếu có)
        if (order_voucherId) {
            // Kiểm tra xem user đã sở hữu voucher chưa
            const userVoucher = await userVoucherModel.findOne({
                vc_user_id: userId,
                vc_vouchers: { $in: [order_voucherId] },
            });
            if (!userVoucher) {
                throw new NotFoundError('Bạn không sở hữu voucher này');
            }
            // Tìm mã giảm giá trong DB
            const voucher = await Voucher.findById(order_voucherId);
            if (!voucher) {
                throw new NotFoundError('Không tìm thấy voucher');
            }
            // Kiểm tra xem user đã sử dụng voucher này chưa
            const hasUserUsedVoucher = voucher.voucher_users_used.some((userUsedId) => userUsedId.toString() === userId.toString());
            if (hasUserUsedVoucher) {
                throw new BadRequestError('Bạn đã đạt giới hạn số lần sử dụng voucher này');
            }
            // Giá trị đơn hàng tối thiểu để áp dụng voucher
            if (totalPrice < voucher.voucher_min_order_value) {
                throw new BadRequestError(`Giá trị đơn hàng tối thiểu ${voucher.voucher_min_order_value}`);
            }
            if (voucher.voucher_method === 'percent') {
                // Nếu giảm giá theo phần trăm
                const discount = (totalPrice * voucher.voucher_value) / 100; // Tính số tiền giảm
                // Áp dụng giảm giá, nhưng không vượt quá giá trị tối đa của voucher
                totalApplyDiscount += Math.min(discount, voucher.voucher_max_price || Infinity);
            } else {
                // Nếu giảm giá theo số tiền cố định
                totalApplyDiscount += voucher.voucher_value; //
            }
        }
        // Bước 4: Thêm phí vận chuyển
        const shipping = await shippingCompany.findById(order_shipping_company); // Tìm công ty vận chuyển
        if (!shipping) throw new NotFoundError('Không tìm thấy công ty vận chuyển'); // Nếu không tìm thấy, báo lỗi
        const shippingPrice = shipping.sc_shipping_price || 0; // Lấy phí vận chuyển, mặc định là 0 nếu không có
        // Tạo đơn hàng mới trong DB
        const order_date_shipping = {
            from: new Date(Date.now() + shipping.sc_delivery_time.from * 24 * 60 * 60 * 1000), // Thời gian hiện tại
            to: new Date(Date.now() + shipping.sc_delivery_time.to * 24 * 60 * 60 * 1000),
        };
        //Ngày giao hàng dự kiến (có thể để trống)
        const newOrder = await OnlineOrder.create([
            {
                order_user: userId, // Người đặt hàng
                order_products: productsToOrder, // Danh sách sản phẩm
                order_voucher: order_voucherId, // Mã giảm giá (nếu có)
                order_total_price: totalPrice, // Tổng giá trị đơn hàng
                order_total_apply_discount: totalApplyDiscount, // tổng discount
                order_date_shipping,
                order_payment_method, // Phương thức thanh toán
                order_shipping_address, // Địa chỉ giao hàng
                order_shipping_price: shippingPrice, // Phí vận chuyển
                order_shipping_company, // Công ty vận chuyển
            },
        ]);
        if (newOrder) {
            // Cập nhật số lượng sản phẩm trong kho
            await Promise.all(
                order_products.map((item) =>
                    Product.findByIdAndUpdate(item.productId, {
                        $inc: {
                            product_quantity: -item.quantity, // Giảm số lượng tồn kho
                            product_sold: item.quantity, // Tăng số lượng đã bán
                        },
                    }),
                ),
            );
            // Cập nhật thông tin mã giảm giá (nếu có)
            if (order_voucherId) {
                await Voucher.findByIdAndUpdate(
                    order_voucherId,
                    { $push: { voucher_users_used: userId } }, // Thêm userId vào danh sách người đã dùng voucher
                );
            }
            // Xóa sản phẩm khỏi giỏ hàng của người dùng
            await Cart.findOneAndUpdate(
                { cart_user: userId }, // Tìm giỏ hàng của người dùng
                {
                    $pull: {
                        cart_products: {
                            productId: { $in: order_products.map((item) => item.productId) }, // Xóa các sản phẩm đã đặt
                        },
                    },
                },
            );
        }
        return newOrder;
    }

    static async getAllOrdersByUser({ userId, limit = 10, page = 0 }) {
        const limitNum = parseInt(limit, 10); // Mặc định limit = 10
        const pageNum = parseInt(page, 10); // Mặc định page = 0
        const skipNum = pageNum * limitNum;
        const orders = await OnlineOrder.find({ order_user: userId })
            .select('order_code order_total_price order_shipping_price order_total_apply_discount order_payment_method order_status')
            .skip(skipNum)
            .limit(limitNum)
            .lean();
        const totalOrders = await OnlineOrder.countDocuments({ order_user: userId });
        return {
            totalPage: Math.ceil(totalOrders / limitNum) - 1, // Tổng số trang (0-based)
            currentPage: pageNum,
            totalOrders,
            orders,
        };
    }

    static async updateOrderStatus({ orderId, newStatus }) {
        if (!orderId) throw new BadRequestError('Không tìm thấy đơn hàng');
        const validStatuses = ['pending', 'confirm', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(newStatus)) throw new BadRequestError('Trạng thái không hợp lệ');
        const updatedOrder = await OnlineOrder.findOneAndUpdate({ _id: orderId }, { order_status: newStatus, updatedAt: new Date() }, { new: true });
        if (!updatedOrder) throw new BadRequestError('Không tìm thấy đơn hàng');
        // Nếu đơn hàng được giao thành công, thêm sản phẩm vào model PurchasedProduct
        if (newStatus === 'delivered') {
            const orderItems = updatedOrder.order_products;
            for (const item of orderItems) {
                // Kiểm tra xem sản phẩm đã được mua trước đó chưa
                const existingProduct = await PurchasedModel.findOne({
                    pc_userId: updatedOrder.order_user,
                    pc_productId: item.productId,
                });
                if (existingProduct) {
                    // Nếu sản phẩm đã tồn tại, cập nhật số lượng
                    existingProduct.pc_quantity += item.quantity;
                    await existingProduct.save();
                } else {
                    // Nếu sản phẩm chưa tồn tại, tạo bản ghi mới
                    await PurchasedModel.create({
                        pc_userId: updatedOrder.order_user,
                        pc_productId: item.productId,
                        pc_quantity: item.quantity,
                        pc_purchaseDate: new Date(),
                    });
                }
            }
        }
        return updatedOrder;
    }

    static async getAllOrdersByUser({ userId, limit = 10, page = 0 }) {
        const limitNum = parseInt(limit, 10); // Mặc định limit = 10
        const pageNum = parseInt(page, 10); // Mặc định page = 0
        const skipNum = pageNum * limitNum;
        const orders = await OnlineOrder.find({ order_user: userId })
            .select('order_code order_total_price order_shipping_price order_total_apply_discount order_payment_method order_status')
            .skip(skipNum)
            .limit(limitNum)
            .sort({ createdAt: -1 }) // 🔥 Sắp xếp mới nhất trước
            .lean();
        const totalOrders = await OnlineOrder.countDocuments({ order_user: userId });
        return {
            totalPage: Math.ceil(totalOrders / limitNum) - 1, // Tổng số trang (0-based)
            currentPage: pageNum,
            totalOrders,
            orders,
        };
    }
    static async getAllOrders({ status }) {
        const fillter = {};
        if (status) fillter.order_status = status;

        const orders = await OnlineOrder.find(fillter)
            .select('order_code order_shipping_address  order_status order_total_price order_products createdAt') // chọn thêm createdAt nếu cần
            .populate({
                path: 'order_products.productId',
                select: 'product_name',
            })
            .sort({ createdAt: -1 }) // 🔥 Sắp xếp mới nhất trước
            .lean();

        return orders;
    }

    static async getOrder(orderId) {
        if (!orderId) throw new BadRequestError('Không tìm thấy đơn hàng');
        const order = await OnlineOrder.findById(orderId).populate('order_user', 'user_name').populate('order_products.productId', 'product_thumb'); // Populate productId with only product_thumb
        if (!order) throw new BadRequestError('Không tìm thấy đơn hàng');
        // Transform products array
        const products = order.order_products.map((p) => ({
            product_thumb: p.productId?.product_thumb,
            quantity: p.quantity,
            discount: p.discount,
            price: p.price,
        }));

        // Convert to plain object and replace order_products
        const orderObject = order.toObject();
        orderObject.order_products = products;

        return orderObject;
    }
    static async getAllOfflineOrders(query) {
        const { page = 1, limit = 20, sortBy = 'createdAt', order = 'desc' } = query;
        const skip = (page - 1) * limit;
    
        const orders = await OfflineOrder.find()
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
            .skip(Number(skip))
            .limit(Number(limit))
            .populate('order_staff') // nếu muốn lấy thông tin nhân viên tạo đơn
            .lean();
    
        const total = await OfflineOrder.countDocuments();
    
        return {
            total,
            page: Number(page),
            limit: Number(limit),
            orders,
        };
    }
}

module.exports = OrderService;
