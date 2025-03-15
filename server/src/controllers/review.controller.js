const ReviewService = require("../services/review.service");

class ReviewController {
    // 📝 Tạo đánh giá
    static async createReview(req, res) {
            const review = await ReviewService.createReview({
                userId: req.user.id,
                ...req.body
            });
            res.status(201).json({ message: "Đánh giá đã được gửi", review });
    }

    // 📖 Lấy danh sách đánh giá
    static async getReviews(req, res) {
            const reviews = await ReviewService.getReviews(req.params.productId);
            res.status(200).json(reviews);
    }

    // ✅ Admin duyệt đánh giá
    static async approveReview(req, res) {
            const review = await ReviewService.approveReview(req.params.reviewId);
            res.status(200).json({ message: "Đánh giá đã được duyệt", review });
    }

    // ❌ Xóa đánh giá
    static async deleteReview(req, res) {
            const review = await ReviewService.deleteReview(req.params.reviewId);
            res.status(200).json({ message: "Đánh giá đã được xóa", review });
    }
    static async getAllReviews(req, res) {
        const result = await ReviewService.getAllReviews();
        res.status(200).json(result);
    }
    
}

module.exports = ReviewController;
