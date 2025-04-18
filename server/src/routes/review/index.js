const express = require('express');
const ReviewController = require('../../controllers/review.controller');
const asyncHandle = require('../../helper/asyncHandle');
const { adminAuthentication, restrictTo } = require('../../middlewares/auth.admin.middleware');
const PERMISSIONS = require('../../config/permissions');
const { userAuthentication } = require('../../middlewares/auth.user.middleware');
const router = express.Router();

/* ================================
   📌 API Dành cho Người Dùng
   ================================ */
router.post('/add', [userAuthentication], asyncHandle(ReviewController.createReview)); // 📝 Tạo đánh giá
router.get('/:productId/search', asyncHandle(ReviewController.getReviews)); // 📖 Lấy đánh giá đã duyệt theo sản phẩm

/* ================================
   🛡️ API Dành cho Admin
   ================================ */
router.use(adminAuthentication); // ✅ Yêu cầu đăng nhập admin
router.use(restrictTo(PERMISSIONS.REVIEW_MANAGE)); // ✅ Có quyền REVIEW_MANAGE

router.put('/:reviewId/approve', asyncHandle(ReviewController.approveReview)); // ✅ Duyệt đánh giá
router.delete('/:reviewId/delete', asyncHandle(ReviewController.deleteReview)); // ❌ Xoá đánh giá

// 📖 Lấy các tab đánh giá
router.get('/all', asyncHandle(ReviewController.getAllReviews));         // 📌 Tất cả
router.get('/approved', asyncHandle(ReviewController.getApprovedReviews)); // ✅ Đã duyệt
router.get('/pending', asyncHandle(ReviewController.getPendingReviews));   // ❗ Chờ duyệt

module.exports = router;
