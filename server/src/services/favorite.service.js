'use strict';

const mongoose = require('mongoose');
const { RequestError } = require('../core/error.response');
const FavoriteProduct = require('../models/favoriteProduct.model');
const Product = require('../models/product.model');

class FavoriteProductService {
    // Thêm sản phẩm vào danh sách yêu thích
    static async addFavoriteProduct(userId, productId) {
        if (!userId || !productId) {
            throw new RequestError('Thiếu thông tin người dùng hoặc sản phẩm', 400);
        }

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
            throw new RequestError('ID người dùng hoặc sản phẩm không hợp lệ', 400);
        }

        // Kiểm tra xem sản phẩm có tồn tại không
        const product = await Product.findById(productId);
        if (!product) {
            throw new RequestError('Sản phẩm không tồn tại', 404);
        }

        // Tìm danh sách yêu thích của người dùng
        let userFavorites = await FavoriteProduct.findOne({ fp_user_id: userId });

        if (userFavorites) {
            // Kiểm tra xem sản phẩm đã có trong danh sách yêu thích chưa
            if (userFavorites.fp_products.includes(productId)) {
                return {
                    success: true,
                    message: 'Sản phẩm đã có trong danh sách yêu thích',
                    data: { isFavorite: true },
                };
            }

            // Thêm sản phẩm vào danh sách yêu thích
            userFavorites.fp_products.push(productId);
            await userFavorites.save();
        } else {
            // Tạo mới danh sách yêu thích
            userFavorites = await FavoriteProduct.create({
                fp_user_id: userId,
                products: [productId],
            });
        }
        // Tăng số lượt thích của sản phẩm
        await Product.findByIdAndUpdate(productId, { $inc: { product_likes: 1 } });
        return {
            success: true,
            message: 'Đã thêm sản phẩm vào danh sách yêu thích',
            data: { isFavorite: true },
        };
    }

    // Xóa sản phẩm khỏi danh sách yêu thích
    static async removeFavoriteProduct(userId, productId) {
        if (!userId || !productId) {
            throw new RequestError('Thiếu thông tin người dùng hoặc sản phẩm', 400);
        }
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
            throw new RequestError('ID người dùng hoặc sản phẩm không hợp lệ', 400);
        }
        // Kiểm tra xem sản phẩm có tồn tại không
        const product = await Product.findById(productId);
        if (!product) {
            throw new RequestError('Sản phẩm không tồn tại', 404);
        }
        // Tìm danh sách yêu thích của người dùng
        const userFavorites = await FavoriteProduct.findOne({ fp_user_id: userId });
        if (!userFavorites || !userFavorites.fp_products.includes(productId)) {
            return 'Sản phẩm không có trong danh sách yêu thích';
        }
        // Xóa sản phẩm khỏi danh sách yêu thích
        userFavorites.fp_products = userFavorites.fp_products.filter((id) => id.toString() !== productId.toString());
        if (userFavorites.fp_products.length === 0) {
            await FavoriteProduct.deleteOne({ fp_user_id: userId });
        } else {
            await userFavorites.save();
        }
        // Giảm số lượt thích của sản phẩm
        await Product.findByIdAndUpdate(productId, { $inc: { product_likes: -1 } });
        return 'Đã xóa sản phẩm khỏi danh sách yêu thích';
    }

    // Lấy danh sách sản phẩm yêu thích của người dùng
    static async getUserFavoriteProducts(userId) {
        if (!userId) {
            throw new RequestError('Thiếu thông tin người dùng', 400);
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new RequestError('ID người dùng không hợp lệ', 400);
        }

        const favorites = await FavoriteProduct.findOne({ fp_user_id: userId })
            .populate({
                path: 'fp_products',
                select: 'product_thumb product_price product_slug product_name product_discounted_price product_discount',
            })
            .lean();

        return favorites || { fp_user_id: userId, products: [] };
    }
}

module.exports = FavoriteProductService;
