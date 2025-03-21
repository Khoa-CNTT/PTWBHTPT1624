"use strict";

const express = require("express");
const router = express.Router();
const FavoriteProductController = require("../../controllers/favorite.controller");
const { userAuthentication } = require("../../middlewares/auth.user.middleware");

// Middleware kiểm tra đăng nhập cho tất cả route
router.use(userAuthentication);

// API toggle yêu thích sản phẩm (thêm nếu chưa có, xóa nếu đã tồn tại)
router.post("/toggle", FavoriteProductController.toggleFavoriteProduct);

// API lấy danh sách sản phẩm yêu thích của user
router.get("/all", FavoriteProductController.getUserFavoriteProducts);

module.exports = router;
