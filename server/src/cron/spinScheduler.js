const cron = require('node-cron');
const userModel = require('../models/user.model');
const notificationModel = require('../models/notification.model');

// Tác vụ chạy lúc 00:00 mỗi ngày
cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Bắt đầu cộng 3 lượt quay cho tất cả user...');
    try {
        await userModel.updateMany(
            {},
            {
                $inc: { user_spin_turns: 3 },
                $set: { user_lastSpinIncrement: new Date() },
            },
        );
        const users = await userModel.find({}, '_id').lean();
        if (!users.length) throw new NotFoundError('Không có người dùng nào!');
        const data = {
            notification_title: '🎉 Bạn nhận được 3 lượt quay miễn phí mỗi ngày!',
            notification_subtitle: '🌀 Hãy vào Vòng quay may mắn để sử dụng lượt quay của bạn và săn quà hấp dẫn!',
            notification_imageUrl: 'https://bizweb.dktcdn.net/thumb/grande/100/004/714/articles/vong-quay-may-man-cu-quay-la-trung-thuong.jpg?v=1532916523767',
            notification_link: '/nguoi-dung/thong-tin-tai-khoan',
        };
        const notifications = users.map((user) => ({
            notification_user: user._id,
            ...data,
        }));

        console.log('✅ Đã cộng 3 lượt quay cho tất cả user');
        return await notificationModel.insertMany(notifications);
    } catch (error) {
        console.error('❌ Lỗi khi cộng lượt quay:', error);
    }
});
