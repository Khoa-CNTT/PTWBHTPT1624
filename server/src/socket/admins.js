// socket/admins.js
let onlineAdmins = [];

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

const getOnlineAdmins = () => onlineAdmins;

module.exports = { addAdmin, removeAdmin, getAdminById, getOnlineAdmins };
