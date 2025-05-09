// socket/users.js
let onlineUsers = [];

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

const getOnlineUsers = () => onlineUsers;

module.exports = { addUser, removeUser, getUserById, getOnlineUsers };
