const express = require("express");
const ReviewController = require("../../controllers/review.controller");
const asyncHandle = require("../../helper/asyncHandle");
const { adminAuthentication ,restrictTo} = require("../../middlewares/auth.admin.middleware");
const PERMISSIONS = require("../../config/permissions");

const router = express.Router();

/* ================================
   📌 API Dành cho Người Dùng (Đánh giá sản phẩm)
   ================================ */
router.post("/add", userAuthentication, asyncHandle(ReviewController.createReview)); // 📝 Tạo đánh giá
router.get("/:productId/search", asyncHandle(ReviewController.getReviews)); // 📖 Lấy danh sách đánh giá

/* ================================
   🛡️ API Dành cho Admin (Quản lý Đánh Giá)
   ================================ */
router.use(adminAuthentication); // ✅ Yêu cầu xác thực
// 🚫 Chỉ những người có quyền REVIEW_MANAGE hoặc REVIEW_VIEW_ALL mới được phép quản lý đánh giá
router.use(restrictTo(PERMISSIONS.REVIEW_MANAGE));

router.put("/:reviewId/approve", asyncHandle(ReviewController.approveReview)); // ✅ Duyệt đánh giá
router.delete("/:reviewId/delete", asyncHandle(ReviewController.deleteReview)); // ❌ Xóa đánh giá
router.get("/all", asyncHandle(ReviewController.getAllReviews)); // 📖 Xem tất cả đánh giá

module.exports = router;
