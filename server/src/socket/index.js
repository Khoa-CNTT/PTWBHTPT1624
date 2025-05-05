const { Server } = require('socket.io');

const createSocket = (httpServer) => {
    let onlineUsers = [];
    let onlineAdmins = [];

    const io = new Server(httpServer, {
        cors: {
            origin: process.env.URL_CLIENT,
        },
    });

    // ======= Helper Functions =======
    const addUser = (userId, socketId) => {
        if (!onlineUsers.some((user) => user.userId === userId)) {
            onlineUsers.push({ userId, socketId });
        }
    };

    const removeUser = (socketId) => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
    };

    const getUserById = (userId) => {
        return onlineUsers.find((user) => user.userId === userId);
    };

    const addAdmin = (adminId, socketId) => {
        if (!onlineAdmins.some((admin) => admin.adminId === adminId)) {
            onlineAdmins.push({ adminId, socketId });
        }
    };

    const removeAdmin = (socketId) => {
        onlineAdmins = onlineAdmins.filter((admin) => admin.socketId !== socketId);
    };

    const getAdminById = (adminId) => {
        return onlineAdmins.find((admin) => admin.adminId === adminId);
    };

    // ======= Socket Connection =======
    io.on('connection', (socket) => {
        console.log('🔌 New client connected:', socket.id);

        // === Khi user kết nối ===
        socket.on('addUser', (userId) => {
            if (userId) {
                addUser(userId, socket.id);
            }
            io.emit('getUserOnline', onlineUsers);
        });

        // === Khi admin kết nối ===
        socket.on('addAdmin', (adminId) => {
            if (adminId) {
                addAdmin(adminId, socket.id);
            }
            io.emit('getAdminOnline', onlineAdmins);
        });

        // === Gửi thông báo đến người dùng cụ thể ===
        socket.on('sendNotification', (data) => {
            const user = getUserById(data.userId);
            if (user) {
                socket.to(user.socketId).emit('getNotification', data, (ack) => {
                    console.log(ack ? `✅ Notification sent to socket ${user.socketId}` : `❌ Failed to send notification to socket ${user.socketId}`);
                });
            }
        });
        socket.on('sendNotificationUserOnline', async (data) => {
            if (onlineUsers.length === 0) return;
            console.log('📨 Gửi tin nhắn đến các user online...');
            const sendPromises = onlineUsers.map(
                (user) =>
                    new Promise((resolve) => {
                        socket.to(user.socketId).emit('getNotificationUserOnline', data, (ack) => {
                            if (ack) {
                                resolve(`✅ Sent to user ${user.socketId}`);
                            } else {
                                resolve(`❌ Failed to send to admin ${user.socketId}`);
                            }
                        });
                    }),
            );
            const results = await Promise.all(sendPromises);
            results.forEach((result) => console.log(result));
        });
        // === Gửi tin nhắn đến người dùng cụ thể ===
        socket.on('sendMessage', (data) => {
            const user = getUserById(data.receiver);
            if (user) {
                socket.to(user.socketId).emit('getMessage', data, (ack) => {
                    console.log(ack ? `✅ Message sent to socket ${user.socketId}` : `❌ Failed to send message to socket ${user.socketId}`);
                });
            }
        });
        socket.on('sendMessageForAdminOnline', async (data) => {
            if (onlineAdmins.length === 0) return;
            console.log('📨 Gửi tin nhắn đến các admin online...');
            const sendPromises = onlineAdmins.map(
                (admin) =>
                    new Promise((resolve) => {
                        socket.to(admin.socketId).emit('getMessageByAdmin', data, (ack) => {
                            if (ack) {
                                resolve(`✅ Sent to admin ${admin.socketId}`);
                            } else {
                                resolve(`❌ Failed to send to admin ${admin.socketId}`);
                            }
                        });
                    }),
            );
            const results = await Promise.all(sendPromises);
            results.forEach((result) => console.log(result));
        });

        socket.on('sendNotificationForAdminOnline', async (data) => {
            if (onlineAdmins.length === 0) return;
            console.log('📨 Gửi tin nhắn đến các admin online...');
            const sendPromises = onlineAdmins.map(
                (admin) =>
                    new Promise((resolve) => {
                        socket.to(admin.socketId).emit('getNotificationByAdmin', data, (ack) => {
                            if (ack) {
                                resolve(`✅ Sent to admin ${admin.socketId}`);
                            } else {
                                resolve(`❌ Failed to send to admin ${admin.socketId}`);
                            }
                        });
                    }),
            );
            const results = await Promise.all(sendPromises);
            results.forEach((result) => console.log(result));
        });

        // === Ngắt kết nối ===
        socket.on('disconnect', () => {
            console.log('❌ Client disconnected:', socket.id);
            removeUser(socket.id);
            removeAdmin(socket.id);
            io.emit('getUserOnline', onlineUsers);
            io.emit('getUser', onlineUsers); // Cập nhật lại danh sách người dùng online cho tất cả client
        });
    });
};

module.exports = createSocket;
