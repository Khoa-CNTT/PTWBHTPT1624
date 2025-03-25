"use strict";
// const purchasedProductModel = require("../models/purchasedProduct.model"); 

 

class PurchasedProductService {
    // 📝 Tạo đánh giá mới
    static async getByUser({ userId, limit = 10, page = 0 }) {
        const limitNum = parseInt(limit, 10); // Mặc định limit = 10
        const pageNum = parseInt(page, 10); // Mặc định page = 0
        const skipNum = pageNum * limitNum;
        // const PurchasedProduct = await  purchasedProductModel.find({ pc_userId: userId })
        //     .skip(skipNum)
        //     .limit(limitNum)
        //     .lean();
        // const totalProducts = await purchasedProductModel.countDocuments({ order_user: userId });
        // return {
        //     totalPage: Math.ceil(totalProducts / limitNum) - 1, // Tổng số trang (0-based)
        //     currentPage: pageNum,
        //     totalProducts,
        //     PurchasedProduct,
        // };
    }
}


module.exports = PurchasedProductService;
