"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const Review = require("../models/reviews.model");
const PurchasedProduct = require("../models/purchasedProduct.model");
const Order = require("../models/order.model"); // ✅ Import đúng đường dẫn đến model


class ReviewService {
    // 📝 Tạo đánh giá mới
    static async createReview(payload) {
        const { userId, review_productId, review_rating, review_comment, review_images } = payload;

        // Kiểm tra thông tin bắt buộc
        if (!userId || !review_productId || !review_comment) {
            throw new BadRequestError("Thiếu thông tin để tạo đánh giá");
        }

        // 📌 Kiểm tra xem user đã từng mua sản phẩm này chưa
        const hasPurchased = await Order.findOne({
            order_user: userId,
            "order_products.productId": review_productId,
            order_status: { $in: ["pending", "confirmed", "delivered"] } // tuỳ logic bạn cho phép
        });

        // ❗ Nếu chưa mua mà lại có rating > 0 thì không hợp lệ
        if (!hasPurchased && review_rating > 0) {
            throw new BadRequestError("Chỉ người đã mua sản phẩm mới được đánh giá sao");
        }

        // ✅ Nếu đã mua thì:
        // - Cho đánh giá sao
        // - Tự động được duyệt
        // ❌ Nếu chưa mua thì:
        // - Không cho rating
        // - Phải chờ duyệt
        const finalRating = hasPurchased ? review_rating : 0;
        const isApproved = !!hasPurchased;

        // 🆕 Tạo đánh giá
        const newReview = await Review.create({
            review_user: userId,
            review_productId,
            review_rating: finalRating,
            review_comment,
            review_images,
            isApproved
        });

        return newReview;
    }
    

    // 📖 Lấy danh sách đánh giá đã duyệt cho sản phẩm
    static async getReviews(productId) {
        const reviews = await Review.find({ review_productId: productId, isApproved: true })
            .populate("review_user", "user_name user_avatar_url");
        return reviews;
    }

    // ✅ Lấy đánh giá CHƯA được duyệt
    static async getPendingReviews() {
        const reviews = await Review.find({ isApproved: false })
            .populate("review_user", "user_name user_avatar_url");
        return reviews;
    }

    // ✅ Admin duyệt đánh giá
    static async approveReview(reviewId) {
        const review = await Review.findByIdAndUpdate(
            reviewId,
            { isApproved: true },
            { new: true }
        );
        if (!review) throw new NotFoundError("Không tìm thấy đánh giá");
        return review;
    }

    // ❌ Xoá đánh giá
    static async deleteReview(reviewId) {
        const review = await Review.findByIdAndDelete(reviewId);
        if (!review) throw new NotFoundError("Không tìm thấy đánh giá");
        return review;
    }

    // 📖 Lấy tất cả đánh giá (Admin)
    static async getAllReviews() {
        const reviews = await Review.find({})
            .populate("review_user", "user_name user_avatar_url");
        return reviews;
    }
}

module.exports = ReviewService;
