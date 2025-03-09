"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const Order = require("../models/order.model");
const productModel = require("../models/product.model");
const voucherModel = require("../models/voucher.model");
const { convertToObjectIdMongodb } = require("../utils");

class OrderService {
  static async createOrder(payload) {

    const { userId, order_shipping_company, order_shipping_address,
      order_payment_method, order_voucherId, order_products,
    } = payload
    // lấy ra giá của sản phẩm
    const products = await Promise.all(order_products.map(async (product) => {
      const foundProduct = await productModel.findById(convertToObjectIdMongodb(product.productId));
      if (foundProduct) {
        let newPrice = (foundProduct.product_price * 100 - foundProduct.product_price * foundProduct.product_discount) / 100
        return {
          productId: foundProduct._id,
          price: newPrice,
          quantity: product.quantity,
        }
      }
    }))
    // tính tổng tiền
    let totalPrice = products.reduce((acc, product) => {
      return acc + (product.quantity * product.price)
    }, 0);
    // 1/ nếu có voucher thì check hạn sử dụng và giá trị đơn hàng tối thiểu để áp dụng voucher
    // 2/ check mức giảm giá tối đa (nếu là percent) voucher_max_price
    if (order_voucherId) {
      const voucher = await voucherModel.findById(order_voucherId)
      if (voucher.voucher_method == "percent") {
        const discountPrice = (totalPrice * 100 - totalPrice * voucher.voucher_value) / 100
        // check mức giảm giá tối đa 
        if (discountPrice > voucher.voucher_max_price) {
          throw new BadRequestError("Vượt mức giảm giá tối đa cho phép");
        }
        totalPrice -= discountPrice
      } else {
        totalPrice -= voucher.voucher_value
      }
      // thêm vào user đã sử dụng voucher
      voucher.voucher_users_used.push(userId)
      voucher.save()
    }
    return totalPrice


    return payload
  }

}

module.exports = OrderService;
