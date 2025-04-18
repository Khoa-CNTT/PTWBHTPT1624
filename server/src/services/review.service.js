'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const OnlineOrder = require('../models/OnlineOrder');
const Review = require('../models/reviews.model');

class ReviewService {
    // 📝 Tạo đánh giá mới
    static async createReview(payload) {
        const { userId, review_productId, review_rating, review_comment, review_images } = payload;

        if (!userId || !review_productId || !review_comment) {
            throw new BadRequestError('Thiếu thông tin để tạo đánh giá');
        }

        const hasPurchased = await OnlineOrder.findOne({
            order_user: userId,
            'order_products.productId': review_productId,
            order_status: { $in: ['pending', 'confirmed', 'delivered'] },
        });

        if (!hasPurchased && review_rating > 0) {
            throw new BadRequestError('Chỉ người đã mua sản phẩm mới được đánh giá sao');
        }

        const finalRating = hasPurchased ? review_rating : 0;
        const isApproved = !!hasPurchased;

        const newReview = await Review.create({
            review_user: userId,
            review_productId,
            review_rating: finalRating,
            review_comment,
            review_images,
            isApproved,
        });

        return newReview;
    }

    // 📖 Lấy đánh giá đã duyệt cho sản phẩm cụ thể (public)
    static async getReviews(productId) {
        const reviews = await Review.find({ review_productId: productId, isApproved: true })
            .populate('review_user', 'user_name user_avatar_url');
        return reviews;
    }

    // 📖 Lấy tất cả đánh giá (admin)
    static async getAllReviews({ limit, page }) {
        const limitNum = parseInt(limit, 10) || 10;
        const pageNum = parseInt(page, 10) || 0;
        const skipNum = pageNum * limitNum;

        const Reviews = await Review.find()
            .populate('review_user', 'user_name user_avatar_url')
            .sort({ createdAt: -1 })
            .skip(skipNum)
            .limit(limitNum)
            .lean();

        const totalReview = await Review.countDocuments();

        return {
            totalPage: Math.ceil(totalReview / limitNum),
            currentPage: pageNum,
            totalReview,
            Reviews,
        };
    }

    // ✅ Lấy đánh giá đã được duyệt
    static async getApprovedReviews({ limit, page }) {
        const limitNum = parseInt(limit, 10) || 10;
        const pageNum = parseInt(page, 10) || 0;
        const skipNum = pageNum * limitNum;

        const Reviews = await Review.find({ isApproved: true })
            .populate('review_user', 'user_name user_avatar_url')
            .sort({ createdAt: -1 })
            .skip(skipNum)
            .limit(limitNum)
            .lean();

        const totalReview = await Review.countDocuments({ isApproved: true });

        return {
            totalPage: Math.ceil(totalReview / limitNum),
            currentPage: pageNum,
            totalReview,
            Reviews,
        };
    }

    // ❌ Lấy đánh giá chưa được duyệt
    static async getPendingReviews({ limit, page }) {
        const limitNum = parseInt(limit, 10) || 10;
        const pageNum = parseInt(page, 10) || 0;
        const skipNum = pageNum * limitNum;

        const Reviews = await Review.find({ isApproved: false })
            .populate('review_user', 'user_name user_avatar_url')
            .sort({ createdAt: -1 })
            .skip(skipNum)
            .limit(limitNum)
            .lean();

        const totalReview = await Review.countDocuments({ isApproved: false });

        return {
            totalPage: Math.ceil(totalReview / limitNum),
            currentPage: pageNum,
            totalReview,
            Reviews,
        };
    }

    // ✅ Duyệt đánh giá
    static async approveReview(reviewId) {
        const review = await Review.findByIdAndUpdate(reviewId, { isApproved: true }, { new: true });
        if (!review) throw new NotFoundError('Không tìm thấy đánh giá');
        return review;
    }

    // ❌ Xóa đánh giá
    static async deleteReview(reviewId) {
        const review = await Review.findByIdAndDelete(reviewId);
        if (!review) throw new NotFoundError('Không tìm thấy đánh giá');
        return review;
    }
}

module.exports = ReviewService;
