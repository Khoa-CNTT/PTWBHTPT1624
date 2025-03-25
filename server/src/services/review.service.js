"use strict";

const { NotFoundError } = require("../core/error.response");
const Review = require("../models/reviews.model"); 
// const purchasedProductModel = require("../models/purchasedProduct.model"); 
class ReviewService {
    // 📝 Tạo đánh giá mới
    static async createReview(payload) {
        const { userId, review_productId, review_rating, review_comment, review_images } = payload;
        // Kiểm tra xem người dùng mua sản phẩm này chưa
        // const purchasedProduct=await purchasedProductModel.findOne({review_user:userId,review_productId})
        //  // Nếu chưa mua thì không cho đánh giá sao & đánh giá phải đợi duyệt
        //  const finalRating = purchasedProduct ? review_rating : 0;
        // const isApproved = !!purchasedProduct; // Chuyển object thành true/false
        // // Tạo đánh giá mới
        // const newReview = await Review.create({
        //     review_user: userId,
        //     review_productId,
        //     review_rating: finalRating,
        //     review_comment,
        //     review_images,
        //     isApproved
        // });
        // return  newReview 
    }

    // 📖 Lấy danh sách đánh giá (chỉ lấy đánh giá đã duyệt)
    static async getReviews(productId) {
            const reviews = await Review.find({ review_productId: productId, isApproved: true })
                .populate("review_user", "user_name user_avatar_url");
            return   reviews 
    }

    // ✅ Lấy danh sách đánh giá CHƯA được duyệt (chỉ lấy isApproved = false)
    static async getPendingReviews() {
            const reviews = await Review.find({ isApproved: false })
                .populate("review_user",  "user_name user_avatar_url");
            return  reviews 
    }

    // ✅ Duyệt đánh giá (Admin)
    static async approveReview(reviewId) {
        const review = await Review.findByIdAndUpdate(reviewId, { isApproved: true }, { new: true });
        if (!review) throw new NotFoundError("Không tìm thấy đánh giá");
        return  review 
    }

    // ❌ Xóa đánh giá
    static async deleteReview(reviewId) {
        const review = await Review.findByIdAndDelete(reviewId);
        if (!review) throw new NotFoundError("Không tìm thấy đánh giá");
        return  review 
    }
    // 📖 Lấy tất cả đánh giá (Admin)
    static async getAllReviews() {
            const reviews = await Review.find({})
                .populate("review_user", "user_name user_avatar_url");
            return  reviews 
    }

}

module.exports = ReviewService;
