const express = require("express");
const asyncHandle = require("../../helper/asyncHandle");
const { authentication, restrictTo } = require("../../middlewares/authMiddleware");
const PurchasedProductController = require("../../controllers/PurchasedProduct.controller");

const router = express.Router();

router.use(authentication); // ✅ Yêu cầu xác thực
router.get("/all", asyncHandle(PurchasedProductController.getByUser)); // 📖 Xem tất cả đánh giá

module.exports = router;
