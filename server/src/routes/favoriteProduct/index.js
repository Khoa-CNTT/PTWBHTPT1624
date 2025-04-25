'use strict';

const express = require('express');
const router = express.Router();
const FavoriteProductController = require('../../controllers/favorite.controller');
const { userAuthentication } = require('../../middlewares/auth.user.middleware');
const asyncHandle = require('../../helper/asyncHandle');

// Middleware kiểm tra đăng nhập cho tất cả route
router.use(userAuthentication);

// API toggle yêu thích sản phẩm (thêm nếu chưa có, xóa nếu đã tồn tại)
router.post('/add', asyncHandle(FavoriteProductController.addFavoriteProduct));
router.put('/remove', asyncHandle(FavoriteProductController.removeFavoriteProduct));

// API lấy danh sách sản phẩm yêu thích của user
router.get('/all', asyncHandle(FavoriteProductController.getUserFavoriteProducts));

module.exports = router;
