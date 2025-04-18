'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema(
    {
        // Người nhận thông báo (có thể là admin hoặc user)
        notification_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
        // Nội dung thông báo
        notification_title: { type: String, required: true },
        notification_subtitle: { type: String, required: true },
        notification_imageUrl: { type: String, default: '' },
        notification_link: { type: String, default: '' },
        // Trạng thái
        notification_isWatched: { type: Boolean, default: false },
        // Thêm loại thông báo: 'user', 'admin', 'system'...
        notification_type: { type: String, enum: ['user', 'admin'], default: 'user' },
        // Chỉ định nếu đây là thông báo dành cho admin
        isAdminNotification: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Notification', notificationSchema);
