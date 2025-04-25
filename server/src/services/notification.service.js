'use strict';

const Notification = require('../models/notification.model');
const { NotFoundError, RequestError } = require('../core/error.response');
const userModel = require('../models/user.model');

class NotificationService {
    // 🟢 Lấy thông báo của một người dùng
    static async getUserNotifications(userId) {
        const notifications = await Notification.find({ notification_user: userId }).sort({ createdAt: -1 }).lean(); // Sử dụng lean để tối ưu hiệu suất
        // Đếm số lượng thông báo chưa đọc
        const unreadCount = await Notification.countDocuments({
            notification_user: userId,
            notification_isWatched: false,
        });
        return {
            notifications, // Danh sách thông báo
            unreadCount, // Số lượng thông báo chưa đọc
        };
    }
    static async getAdminNotifications() {
        // Lấy tất cả thông báo admin, sắp xếp theo thời gian tạo giảm dần
        const notifications = await Notification.find({ notification_type: 'admin' }).sort({ createdAt: -1 }).lean(); // Sử dụng lean để tối ưu hiệu suất
        // Đếm số lượng thông báo chưa đọc
        const unreadCount = await Notification.countDocuments({
            notification_type: 'admin',
            notification_isWatched: false,
        });
        return {
            notifications, // Danh sách thông báo
            unreadCount, // Số lượng thông báo chưa đọc
        };
    }
    // 🟢 Đánh dấu thông báo là đã đọc
    static async markAsRead(userId) {
        await Notification.updateMany({ notification_user: userId }, { notification_isWatched: true }, { new: true });
    }
    static async markAllAdminNotificationsAsRead() {
        // Cập nhật tất cả thông báo admin thành đã đọc
        await Notification.updateMany({ notification_type: 'admin' }, { notification_isWatched: true }, { new: true });
        // Kiểm tra xem có thông báo nào được cập nhật không
    }

    // 🔴 Gửi thông báo đến tất cả người dùng (Admin, Staff)
    static async sendNotificationToAll(payload) {
        if (!payload.notification_title || !payload.notification_subtitle) {
            throw new RequestError('Vui lòng cung cấp thông tin thông báo');
        }

        const users = await userModel.find({}, '_id').lean();
        if (!users.length) throw new NotFoundError('Không có người dùng nào!');

        const notifications = users.map((user) => ({
            notification_user: user._id,
            ...payload,
        }));

        return await Notification.insertMany(notifications);
    }

    // 🔴 Gửi thông báo đến một người dùng cụ thể (Admin, Staff)
    static async sendNotificationToUser(userId, payload) {
        if (!payload.notification_title || !payload.notification_subtitle) {
            throw new RequestError('Vui lòng cung cấp thông tin thông báo');
        }

        return await Notification.create({
            notification_user: userId,
            ...payload,
        });
    }
    static async sendNotificationToAdmin(payload) {
        if (!payload.notification_title || !payload.notification_subtitle) {
            throw new RequestError('Vui lòng cung cấp thông tin thông báo');
        }
        return await Notification.create({
            ...payload,
            notification_type: 'admin',
        });
    }
}

module.exports = NotificationService;
