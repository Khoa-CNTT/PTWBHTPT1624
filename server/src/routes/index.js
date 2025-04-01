const express = require('express');
const router = express.Router();

// ------- auth ----------
router.use('/v1/api/admin/auth', require('./auth/admin'));
// ===============================
router.use('/v1/api/category', require('./category/index'));
router.use('/v1/api/brand', require('./brand/index'));
router.use('/v1/api/banner', require('./banner/index'));
router.use('/v1/api/cart', require('./cart/index'));
module.exports = router;
