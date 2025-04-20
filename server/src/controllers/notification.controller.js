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
    static getAdminNotifications = asyncHandle(async (req, res) => {
        const notifications = await NotificationService.getAdminNotifications();
        return res.status(200).json({ success: true, data: notifications });
    });

    // 🟢 Đánh dấu thông báo là đã đọc
    static markAsRead = asyncHandle(async (req, res) => {
        const userId = req.user._id;
        await NotificationService.markAsRead(userId);
        return res.status(200).json({ success: true, message: 'Đã đánh dấu là đã đọc' });
    });
    static markAllAdminNotificationsAsRead = asyncHandle(async (req, res) => {
        await NotificationService.markAllAdminNotificationsAsRead();
        return res.status(200).json({ success: true, message: 'Đã đánh dấu là đã đọc' });
    });

    // 🔴 Gửi thông báo đến tất cả người dùng (Admin, Staff)
    static sendNotificationToAll = asyncHandle(async (req, res) => {
        const notification = await NotificationService.sendNotificationToAll(req.body);
        return res.status(201).json({ success: true, message: 'Đã gửi thông báo đến tất cả người dùng', data: notification });
    });

    static sendNotificationToUser = asyncHandle(async (req, res) => {
        const { userId } = req.params;
        const notification = await NotificationService.sendNotificationToUser(userId, req.body);
        return res.status(201).json({ success: true, message: `Đã gửi thông báo đến người dùng ${userId}`, data: notification });
    });
    static sendNotificationToAdmin = asyncHandle(async (req, res) => {
        const notification = await NotificationService.sendNotificationToAdmin(req.body);
        return res.status(201).json({ success: true, message: `Đã gửi thông báo đến admin`, data: notification });
    });
}

module.exports = NotificationController;
