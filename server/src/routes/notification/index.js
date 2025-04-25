'use strict';

const express = require('express');
const NotificationController = require('../../controllers/notification.controller');
const asyncHandle = require('../../helper/asyncHandle');
const { adminAuthentication, restrictTo } = require('../../middlewares/auth.admin.middleware');
const PERMISSIONS = require('../../config/permissions');
const { userAuthentication } = require('../../middlewares/auth.user.middleware');

const router = express.Router();

router.post('/send-to-admin', asyncHandle(NotificationController.sendNotificationToAdmin));
// Yêu cầu đăng nhập
// 🟢 Người dùng: Xem thông báo cá nhân
router.get('/', [userAuthentication], asyncHandle(NotificationController.getUserNotifications));
// 🟢 Người dùng: Đánh dấu đã đọc thông báo
router.put('/read', [userAuthentication], asyncHandle(NotificationController.markAsRead));
// 🔴 Admin/Staff: Gửi thông báo đến tất cả người dùng
router.use(adminAuthentication);
router.get('/all-admin', asyncHandle(NotificationController.getAdminNotifications));
router.post('/send-to-all', asyncHandle(NotificationController.sendNotificationToAll));
router.put('/admin-read', asyncHandle(NotificationController.markAllAdminNotificationsAsRead));
// 🔴 Admin/Staff: Gửi thông báo đến một người dùng cụ thể
router.post('/send-to-user/:userId', asyncHandle(NotificationController.sendNotificationToUser));

module.exports = router;
