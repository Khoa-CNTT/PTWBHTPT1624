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

    // 📖 Lấy danh sách đánh giá (public - chỉ hiển thị đánh giá đã duyệt của sản phẩm)
    static async getReviews(req, res) {
        const reviews = await ReviewService.getReviews(req.params.productId);
        res.status(200).json({ success: true, message: 'Đánh giá đã được duyệt', reviews });
    }

    // ✅ Admin: duyệt đánh giá
    static async approveReview(req, res) {
        const review = await ReviewService.approveReview(req.params.reviewId);
        res.status(200).json({ success: true, message: 'Đánh giá đã được duyệt', review });
    }

    // ❌ Admin: xóa đánh giá
    static async deleteReview(req, res) {
        const review = await ReviewService.deleteReview(req.params.reviewId);
        res.status(200).json({ success: true, message: 'Đánh giá đã được xóa', review });
    }

    // 📖 Admin: tất cả đánh giá
    static async getAllReviews(req, res) {
        const result = await ReviewService.getAllReviews(req.query);
        res.status(200).json({ success: true, data: result });
    }

    // ✅ Admin: đánh giá đã duyệt
    static async getApprovedReviews(req, res) {
        const result = await ReviewService.getApprovedReviews(req.query);
        res.status(200).json({ success: true, data: result });
    }

    // ❗ Admin: đánh giá chờ duyệt
    static async getPendingReviews(req, res) {
        const result = await ReviewService.getPendingReviews(req.query);
        res.status(200).json({ success: true, data: result });
    }
}

module.exports = ReviewController;
