// cron.js
const cron = require('node-cron');
const userModel = require('../models/user.model');
const notificationModel = require('../models/notification.model');
const { getOnlineUsers } = require('../socket/users');
const { getIO } = require('../socket');

cron.schedule('00 12 * * *', async () => {
    console.log('⏰ Gửi thông báo vào lúc 10:42 chỉ cho user online...');
    try {
        const data = {
            notification_title: '🎉 Bạn nhận được 3 lượt quay miễn phí mỗi ngày!',
            notification_subtitle: '🌀 Hãy vào Vòng quay may mắn để sử dụng lượt quay của bạn và săn quà hấp dẫn!',
            notification_imageUrl: 'https://bizweb.dktcdn.net/thumb/grande/100/004/714/articles/vong-quay-may-man-cu-quay-la-trung-thuong.jpg?v=1532916523767',
            notification_link: '/nguoi-dung/thong-tin-tai-khoan',
        };
        const users = await userModel.find({}, '_id').lean();
        if (!users.length) throw new Error('Không có người dùng nào!');

        const notifications = users.map((user) => ({
            notification_user: user._id,
            ...data,
        }));
        await notificationModel.insertMany(notifications);

        // Get online users from socket
        const io = getIO();
        const onlineUsers = getOnlineUsers();

        if (onlineUsers.length === 0) {
            console.log('❌ Không có user online để gửi.');
            return;
        }

        // Send notification to all online users
        onlineUsers.forEach((user) => {
            io.to(user.socketId).emit('getNotificationUser', data, (ack) => {
                console.log(ack ? `✅ Message sent to socket ${user.socketId}` : `❌ Failed to send message to socket ${user.socketId}`);
            });
        });

        console.log(`✅ Đã gửi thông báo cho ${onlineUsers.length} user online.`);
    } catch (error) {
        console.error('❌ Lỗi khi gửi thông báo socket:', error);
    }
});
