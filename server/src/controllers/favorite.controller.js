'use strict';
const FavoriteProductService = require('../services/favorite.service');
class FavoriteProductController {
    // Thêm hoặc xóa sản phẩm khỏi danh sách yêu thích
    static async addFavoriteProduct(req, res) {
        const { productId } = req.body;
        const message = await FavoriteProductService.addFavoriteProduct(req.user._id, productId);
        res.status(201).json({
            success: true,
            message,
        });
    }
    static async removeFavoriteProduct(req, res) {
        const { productId } = req.body;
        const message = await FavoriteProductService.removeFavoriteProduct(req.user._id, productId);
        res.status(201).json({
            success: true,
            message,
        });
    }

    // Lấy danh sách sản phẩm yêu thích của user (bao gồm thông tin chi tiết sản phẩm)
    static async getUserFavoriteProducts(req, res) {
        const data = await FavoriteProductService.getUserFavoriteProducts(req.user._id);
        res.status(201).json({
            success: true,
            data,
        });
    }
}

module.exports = FavoriteProductController;
