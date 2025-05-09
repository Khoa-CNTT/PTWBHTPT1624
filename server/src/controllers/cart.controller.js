'use strict';

const CartService = require('../services/cart.service');
const { RequestError } = require('../core/error.response');

class CartController {
    static async addToCart(req, res, next) {
        const { productId, quantity } = req.body;
        if (!productId || !quantity) throw new RequestError('Thiếu thông tin sản phẩm.');
        const cart = await CartService.addToCart(req.user._id, productId, quantity);
        res.status(201).json({ success: true, message: 'Thêm vào giỏ hàng thành công', data: cart });
    }

    static async getCartByUserId(req, res, next) {
        const cart = await CartService.getCartByUserId(req.user._id);
        res.status(200).json({ success: true, data: cart });
    }

    static async updateCart(req, res, next) {
        const { productId, quantity } = req.body;
        if (!productId || quantity <= 0) throw new RequestError('Thông tin không hợp lệ.');
        const cart = await CartService.updateCart(req.user._id, productId, quantity);
        res.status(200).json({ success: true, data: cart });
    }

    static async removeFromCart(req, res, next) {
        const cart = await CartService.removeFromCart(req.user._id, req.params.pid);
        res.status(200).json({ success: true, data: cart });
    }

    static async clearCart(req, res, next) {
        const response = await CartService.clearCart(req.user._id);
        res.status(200).json({ success: true, message: response.message });
    }
}

module.exports = CartController;
