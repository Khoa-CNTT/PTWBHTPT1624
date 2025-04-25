const express = require('express');
const asyncHandle = require('../../helper/asyncHandle');
const PurchasedProductController = require('../../controllers/purchasedProduct.controller');
const { userAuthentication } = require('../../middlewares/auth.user.middleware');

const router = express.Router();

router.use(userAuthentication); // ✅ Yêu cầu xác thực
router.get('/all', asyncHandle(PurchasedProductController.getByUser)); // 📖 Xem tất cả đánh giá

module.exports = router;
