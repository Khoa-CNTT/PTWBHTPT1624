'use strict';

const { RequestError, NotFoundError } = require('../core/error.response');
const OnlineOrder = require('../models/OnlineOrder');
const PurchasedModel = require('../models/Purchased.model');
const Review = require('../models/reviews.model');
const userModel = require('../models/user.model');

class ReviewService {
    // 📝 Tạo đánh giá mới
    static async createReview(payload) {
        const { userId, review_productId, review_rating = 0, review_comment, review_images } = payload;
        if (!userId || !review_productId || !review_comment) {
            throw new RequestError('Thiếu thông tin để tạo đánh giá');
        }
        await userModel.findByIdAndUpdate(userId, {
            $inc: { user_reward_points: 50000 },
        });
        const hasPurchased = await PurchasedModel.findOne({
            pc_userId: userId,
            pc_productId: review_productId,
        });

        if (!hasPurchased && review_rating > 0) {
            throw new RequestError('Chỉ người đã mua sản phẩm mới được đánh giá sao');
        }

        if (hasPurchased) {
            hasPurchased.pc_isReviewed = true;
            await hasPurchased.save();
        }

        const newReview = await Review.create({
            review_user: userId,
            review_productId,
            review_rating: hasPurchased ? review_rating : 0,
            review_comment,
            review_images,
            isApproved: !!hasPurchased,
        });

        return newReview;
    }

    // ✏️ Cập nhật đánh giá
    static async updateReview(payload) {
        const { userId, reviewId, review_productId, review_rating = 0, review_comment, review_images } = payload;

        if (!userId || !reviewId || !review_productId || !review_comment) {
            throw new RequestError('Thiếu thông tin để cập nhật đánh giá');
        }

        const hasPurchased = await PurchasedModel.findOne({
            pc_userId: userId,
            pc_productId: review_productId,
        });

        if (!hasPurchased && review_rating > 0) {
            throw new RequestError('Chỉ người đã mua sản phẩm mới được đánh giá sao');
        }

        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            {
                review_user: userId,
                review_productId,
                review_rating: hasPurchased ? review_rating : 0,
                review_comment,
                review_images,
                isApproved: !!hasPurchased,
            },
            { new: true },
        );

        if (!updatedReview) {
            throw new NotFoundError('Không tìm thấy đánh giá để cập nhật');
        }

        return updatedReview;
    }

    // 📖 Lấy đánh giá đã duyệt cho sản phẩm (Public)
    static async getReviews(productId) {
        if (!productId) {
            throw new RequestError('Thiếu productId để lấy đánh giá');
        }

        const reviews = await Review.find({
            review_productId: productId,
            isApproved: true,
        }).populate('review_user', 'user_name user_avatar_url');

        return reviews;
    }

    // 📖 Lấy tất cả đánh giá (Admin)
    static async getAllReviews({ limit = 10, page = 0 }) {
        const skip = page * limit;

        const [reviews, totalReview] = await Promise.all([
            Review.find().populate('review_user', 'user_name user_avatar_url').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Review.countDocuments(),
        ]);

        return {
            totalPage: Math.ceil(totalReview / limit),
            currentPage: page,
            totalReview,
            reviews,
        };
    }

    // ✅ Lấy đánh giá đã duyệt
    static async getApprovedReviews({ limit = 10, page = 0 }) {
        const skip = page * limit;

        const [reviews, totalReview] = await Promise.all([
            Review.find({ isApproved: true }).populate('review_user', 'user_name user_avatar_url').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Review.countDocuments({ isApproved: true }),
        ]);

        return {
            totalPage: Math.ceil(totalReview / limit),
            currentPage: page,
            totalReview,
            reviews,
        };
    }

    // ❌ Lấy đánh giá chưa được duyệt
    static async getPendingReviews({ limit = 10, page = 0 }) {
        const skip = page * limit;

        const [reviews, totalReview] = await Promise.all([
            Review.find({ isApproved: false }).populate('review_user', 'user_name user_avatar_url').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Review.countDocuments({ isApproved: false }),
        ]);

        return {
            totalPage: Math.ceil(totalReview / limit),
            currentPage: page,
            totalReview,
            reviews,
        };
    }

    // ✅ Duyệt đánh giá
    static async approveReview(reviewId) {
        if (!reviewId) throw new RequestError('Thiếu reviewId để duyệt đánh giá');

        const review = await Review.findByIdAndUpdate(reviewId, { isApproved: true }, { new: true });

        if (!review) throw new NotFoundError('Không tìm thấy đánh giá');

        return review;
    }

    // ❌ Xóa đánh giá
    static async deleteReview(reviewId) {
        if (!reviewId) throw new RequestError('Thiếu reviewId để xóa đánh giá');

        const review = await Review.findByIdAndDelete(reviewId);

        if (!review) throw new NotFoundError('Không tìm thấy đánh giá');

        return review;
    }
}

module.exports = ReviewService;
