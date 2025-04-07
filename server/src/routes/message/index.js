const express = require('express');
const {
    getMessagesByConversation,
    deleteMessage,
    sendMessageByUSer,
    markMessagesAsSeenByAdmin,
    markMessagesAsSeenByUser,
    sendMessageByAdmin,
} = require('../../controllers/message.controller');
const { adminAuthentication, restrictTo } = require('../../middlewares/auth.admin.middleware');
const PERMISSIONS = require('../../config/permissions');
const { userAuthentication } = require('../../middlewares/auth.user.middleware');
const router = express.Router();
// Gửi tin nhắn
router.get('/:conversationId', getMessagesByConversation);
router.post('/by-user', [userAuthentication], sendMessageByUSer);
router.patch('/seen-by-user/:conversationId', [userAuthentication], markMessagesAsSeenByUser);
// Lấy tin nhắn theo conversationId
router.use(adminAuthentication);
router.use(restrictTo(PERMISSIONS.MESSAGE_MANAGE));
// Đánh dấu đã xem tin nhắn
router.patch('/seen-by-admin/:conversationId', markMessagesAsSeenByAdmin);
router.post('/by-admin', sendMessageByAdmin);
router.delete('/:id', deleteMessage);
module.exports = router;
