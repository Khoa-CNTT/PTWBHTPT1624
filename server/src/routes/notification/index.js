"use strict";

const express = require("express");
const NotificationController = require("../../controllers/notification.controller");
const asyncHandle = require("../../helper/asyncHandle");
const { authentication, restrictTo } = require("../../middlewares/authMiddleware");
const PERMISSIONS = require("../../config/permissions");

const router = express.Router();

// Yêu cầu đăng nhập
router.use(authentication);

// 🟢 Người dùng: Xem thông báo cá nhân
router.get("/", asyncHandle(NotificationController.getUserNotifications));

// 🟢 Người dùng: Đánh dấu đã đọc thông báo
router.put("/:id/read", asyncHandle(NotificationController.markAsRead));

// 🔴 Admin/Staff: Gửi thông báo đến tất cả người dùng
router.post(
  "/send-to-all",
  restrictTo(PERMISSIONS.ADMIN, PERMISSIONS.STAFF),
  asyncHandle(NotificationController.sendNotificationToAll)
);

// 🔴 Admin/Staff: Gửi thông báo đến một người dùng cụ thể
router.post(
  "/send-to-user/:userId",
  restrictTo(PERMISSIONS.ADMIN, PERMISSIONS.STAFF),
  asyncHandle(NotificationController.sendNotificationToUser)
);

module.exports = router;
