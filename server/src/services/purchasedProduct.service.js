'use strict';

const { RequestError, NotFoundError } = require('../core/error.response');
const mongoose = require('mongoose');
const PurchasedModel = require('../models/Purchased.model');

class PurchasedProductService {
    // 📝 Tạo đánh giá mới
    static async getByUser({ userId, limit = 10, page = 0 }) {
        const limitNum = parseInt(limit, 10); // Mặc định limit = 10
        const pageNum = parseInt(page, 10); // Mặc định page = 0
        const skipNum = pageNum * limitNum;
        const PurchasedProduct = await PurchasedModel.find({ pc_userId: userId })
            .populate({
                path: 'pc_productId',
                select: 'product_thumb product_price product_code product_slug product_name product_discounted_price product_discount',
            })
            .sort({ pc_isReviewed: 1, createdAt: -1 }) // true trước, rồi theo thời gian mới nhất
            .skip(skipNum)
            .limit(limitNum)
            .lean();

        const totalProducts = await PurchasedModel.countDocuments({ order_user: userId });
        return {
            totalPage: Math.ceil(totalProducts / limitNum), // Tổng số trang (0-based)
            currentPage: pageNum,
            totalProducts,
            PurchasedProduct,
        };
    }
}

module.exports = PurchasedProductService;
