'use strict';

const NotificationService = require('../services/notification.service');
const asyncHandle = require('../helper/asyncHandle');

class NotificationController {
    // 🟢 Lấy danh sách thông báo của người dùng
    static getUserNotifications = asyncHandle(async (req, res) => {
        const userId = req.user._id;
        const notifications = await NotificationService.getUserNotifications(userId);
        return res.status(200).json({ success: true, data: notifications });
    });

    // 🟢 Đánh dấu thông báo là đã đọc
    static markAsRead = asyncHandle(async (req, res) => {
        const { id } = req.params;
        const updatedNotification = await NotificationService.markAsRead(id);
        return res.status(200).json({ success: true, message: 'Đã đánh dấu là đã đọc', data: updatedNotification });
    });

    // 🔴 Gửi thông báo đến tất cả người dùng (Admin, Staff)
    static sendNotificationToAll = asyncHandle(async (req, res) => {
        const notification = await NotificationService.sendNotificationToAll(req.body);
        return res.status(201).json({ success: true, message: 'Đã gửi thông báo đến tất cả người dùng', data: notification });
    });

    // 🔴 Gửi thông báo đến một người dùng cụ thể (Admin, Staff)
    static sendNotificationToUser = asyncHandle(async (req, res) => {
        const { userId } = req.params;
        const notification = await NotificationService.sendNotificationToUser(userId, req.body);
        return res.status(201).json({ success: true, message: `Đã gửi thông báo đến người dùng ${userId}`, data: notification });
    });
}

module.exports = NotificationController;
