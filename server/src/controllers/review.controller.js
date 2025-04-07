const ReviewService = require('../services/review.service');

class ReviewController {
    // 📝 Tạo đánh giá
    static async createReview(req, res) {
        const review = await ReviewService.createReview({
            userId: req.user.id,
            ...req.body,
        });
        res.status(201).json({ success: true, message: 'Đánh giá đã được gửi', review });
    }

    // 📖 Lấy danh sách đánh giá
    static async getReviews(req, res) {
        const reviews = await ReviewService.getReviews(req.params.productId);
        res.status(200).json({ success: true, message: 'Đánh giá đã được duyệt', reviews });
    }

    // ✅ Admin duyệt đánh giá
    static async approveReview(req, res) {
        const review = await ReviewService.approveReview(req.params.reviewId);
        res.status(200).json({ success: true, message: 'Đánh giá đã được duyệt', review });
    }

    // ❌ Xóa đánh giá
    static async deleteReview(req, res) {
        const review = await ReviewService.deleteReview(req.params.reviewId);
        res.status(200).json({ success: true, message: 'Đánh giá đã được xóa', review });
    }

    static async getPendingReviews(req, res) {
        const result = await ReviewService.getPendingReviews(req.query);
        res.status(200).json({ success: true, data: result });
    }
}

module.exports = ReviewController;
