"use strict";

const Notification = require("../models/notification.model.js");
const { NotFoundError, BadRequestError } = require("../core/error.response");
const userModel = require("../models/user.model.js");

class NotificationService {
  // 🟢 Lấy thông báo của một người dùng
  static async getUserNotifications(userId) {
    return await Notification.find({ notification_user: userId }).sort({ createdAt: -1 });
  }

  // 🟢 Đánh dấu thông báo là đã đọc
  static async markAsRead(notificationId) {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { notification_isWatched: true },
      { new: true }
    );
    if (!notification) throw new NotFoundError("Thông báo không tồn tại!");
    return notification;
  }

  // 🔴 Gửi thông báo đến tất cả người dùng (Admin, Staff)
  static async sendNotificationToAll(payload) {
    if (!payload.notification_title || !payload.notification_subtitle) {
      throw new BadRequestError("Vui lòng cung cấp thông tin thông báo");
    }

    const users = await userModel.find({}, "_id").lean();
    if (!users.length) throw new NotFoundError("Không có người dùng nào!");

    const notifications = users.map(user => ({
      notification_user: user._id,
      ...payload
    }));

    return await Notification.insertMany(notifications);
  }

  // 🔴 Gửi thông báo đến một người dùng cụ thể (Admin, Staff)
  static async sendNotificationToUser(userId, payload) {
    if (!payload.notification_title || !payload.notification_subtitle) {
      throw new BadRequestError("Vui lòng cung cấp thông tin thông báo");
    }

    return await Notification.create({
      notification_user: userId,
      ...payload,
    });
  }
}

module.exports = NotificationService;
