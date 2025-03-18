"use strict";

const NotificationService = require("../services/notification.service");
const asyncHandle = require("../helper/asyncHandle");

class NotificationController {
  // 🟢 Lấy danh sách thông báo của người dùng
  static getUserNotifications = asyncHandle(async (req, res) => {
    const userId = req.user._id;
    const result = await NotificationService.getUserNotifications(userId);
    return res.status(200).json(result);
  });

  // 🟢 Đánh dấu thông báo là đã đọc
  static markAsRead = asyncHandle(async (req, res) => {
    const { id } = req.params;
    const result = await NotificationService.markAsRead(id);
    return res.status(200).json(result);
  });

  // 🔴 Gửi thông báo đến tất cả người dùng (Admin, Staff)
  static sendNotificationToAll = asyncHandle(async (req, res) => {
    const result = await NotificationService.sendNotificationToAll(req.body);
    return res.status(201).json(result);
  });

  // 🔴 Gửi thông báo đến một người dùng cụ thể (Admin, Staff)
  static sendNotificationToUser = asyncHandle(async (req, res) => {
    const { userId } = req.params;
    const result = await NotificationService.sendNotificationToUser(userId, req.body);
    return res.status(201).json(result);
  });
}

module.exports = NotificationController;
