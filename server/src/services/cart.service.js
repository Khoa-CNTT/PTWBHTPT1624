'use strict';

const { RequestError, NotFoundError } = require('../core/error.response');
const Product = require('../models/product.model');
const redisClient = require('../config/redisClient');

class CartService {
    static cartKey(userId) {
        return `cart:${userId}`;
    }

    // Thêm sản phẩm vào giỏ hàng
    static async addToCart(userId, productId, quantity) {
        if (!userId || !productId || quantity <= 0) {
            throw new RequestError('Thông tin không hợp lệ.');
        }

        const product = await Product.findById(productId);
        if (!product) throw new NotFoundError('Sản phẩm không tồn tại.');

        const cartKey = this.cartKey(userId);
        const cartData = await redisClient.get(cartKey);
        let cart = cartData ? JSON.parse(cartData) : [];

        const index = cart.findIndex(item => item.productId === productId);
        if (index > -1) {
            cart[index].quantity += quantity;
        } else {
            cart.push({ productId, quantity });
        }

        await redisClient.set(cartKey, JSON.stringify(cart));
        return this.getCartByUserId(userId);
    }

    // Lấy giỏ hàng của người dùng
    static async getCartByUserId(userId) {
        const cartKey = this.cartKey(userId);
        const cartData = await redisClient.get(cartKey);
        if (!cartData) throw new NotFoundError('Giỏ hàng trống.');

        const cart = JSON.parse(cartData);

        // Lấy thông tin chi tiết sản phẩm
        const products = await Product.find({ _id: { $in: cart.map(item => item.productId) } })
            .select('product_name product_thumb product_price product_discounted_price product_slug')
            .lean();

        const productMap = new Map(products.map(p => [p._id.toString(), p]));

        const detailedCart = cart.map(item => {
            const product = productMap.get(item.productId);
            return {
                productId: item.productId,
                quantity: item.quantity,
                ...product
            };
        });

        return {
            cart_user: userId,
            cart_products: detailedCart
        };
    }

    // Cập nhật số lượng sản phẩm
    static async updateCart(userId, productId, quantity) {
        if (quantity <= 0) throw new RequestError('Số lượng không hợp lệ.');

        const cartKey = this.cartKey(userId);
        const cartData = await redisClient.get(cartKey);
        if (!cartData) throw new NotFoundError('Giỏ hàng không tồn tại.');

        const cart = JSON.parse(cartData);
        const index = cart.findIndex(item => item.productId === productId);
        if (index === -1) throw new NotFoundError('Sản phẩm không có trong giỏ hàng.');

        cart[index].quantity = quantity;
        await redisClient.set(cartKey, JSON.stringify(cart));
        return this.getCartByUserId(userId);
    }

    // Xóa sản phẩm khỏi giỏ hàng
    static async removeFromCart(userId, productId) {
        const cartKey = this.cartKey(userId);
        const cartData = await redisClient.get(cartKey);
        if (!cartData) throw new NotFoundError('Giỏ hàng không tồn tại.');

        const cart = JSON.parse(cartData).filter(item => item.productId !== productId);
        await redisClient.set(cartKey, JSON.stringify(cart));
        return this.getCartByUserId(userId);
    }

    // Xóa toàn bộ giỏ hàng
    static async clearCart(userId) {
        const cartKey = this.cartKey(userId);
        await redisClient.del(cartKey);
        return { message: 'Giỏ hàng đã được xóa thành công.' };
    }
}

module.exports = CartService;
