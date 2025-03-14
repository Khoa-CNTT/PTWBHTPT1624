"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const Review = require("../models/reviews.model");
const Order = require("../models/order.model");
const mongoose = require("mongoose");

class ReviewService {
    // 📝 Tạo đánh giá mới
    static async createReview(payload) {
        const { userId, review_productId, review_rating, review_comment, review_images } = payload;

        // Kiểm tra xem người dùng đã từng mua sản phẩm này chưa
        const hasPurchased = await Order.findOne({
            order_user: new mongoose.Types.ObjectId(userId),
            "order_products.productId": new mongoose.Types.ObjectId(review_productId),
            order_status: "delivered"
        });

        // Kiểm tra xem người dùng đã đánh giá sản phẩm này chưa
        const hasReviewed = await Review.findOne({ review_user: userId, review_productId });
        if (hasReviewed) {
            throw new BadRequestError("Bạn đã đánh giá sản phẩm này rồi.");
        }

        // Nếu chưa mua thì không cho đánh giá sao & đánh giá phải đợi duyệt
        const finalRating = hasPurchased ? review_rating : 0;
        const isApproved = !!hasPurchased; // Chuyển object thành true/false

        // Tạo đánh giá mới
        const newReview = await Review.create({
            review_user: userId,
            review_productId,
            review_rating: finalRating,
            review_comment,
            review_images,
            isApproved
        });

        return {
            message: "Đánh giá đã được gửi",
            review: newReview,
        };
    }

    // 📖 Lấy danh sách đánh giá (chỉ lấy đánh giá đã duyệt)
    static async getReviews(productId) {
        try {
            const reviews = await Review.find({ review_productId: productId, isApproved: true })
                .populate("review_user", "name");

            return {
                message: reviews.length ? "Lấy danh sách đánh giá thành công" : "Không có đánh giá nào.",
                reviews
            };
        } catch (error) {
            throw new Error("Lỗi khi lấy danh sách đánh giá: " + error.message);
        }
    }

    // ✅ Lấy danh sách đánh giá CHƯA được duyệt (chỉ lấy isApproved = false)
    static async getPendingReviews() {
        try {
            const reviews = await Review.find({ isApproved: false })
                .populate("review_user", "name");

            return {
                message: "Lấy danh sách đánh giá chờ duyệt thành công",
                reviews
            };
        } catch (error) {
            throw new Error("Lỗi khi lấy danh sách đánh giá chờ duyệt: " + error.message);
        }
    }

    // ✅ Duyệt đánh giá (Admin)
    static async approveReview(reviewId) {
        const review = await Review.findByIdAndUpdate(reviewId, { isApproved: true }, { new: true });

        if (!review) throw new NotFoundError("Không tìm thấy đánh giá");

        return {
            message: "Đánh giá đã được duyệt",
            review
        };
    }

    // ❌ Xóa đánh giá
    static async deleteReview(reviewId) {
        const review = await Review.findByIdAndDelete(reviewId);
        if (!review) throw new NotFoundError("Không tìm thấy đánh giá");

        return {
            message: "Đánh giá đã được xóa",
            review
        };
    }
    // 📖 Lấy tất cả đánh giá (Admin)
static async getAllReviews() {
    try {
        const reviews = await Review.find({})
            .populate("review_user", "name");

        return {
            message: "Lấy tất cả đánh giá thành công",
            reviews
        };
    } catch (error) {
        throw new Error("Lỗi khi lấy tất cả đánh giá: " + error.message);
    }
}

}

module.exports = ReviewService;
