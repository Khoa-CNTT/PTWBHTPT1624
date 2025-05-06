const express = require('express');
const {
    getMessagesByConversation,
    deleteMessage,
    sendMessageByUSer,
    markMessagesAsSeenByAdmin,
    markMessagesAsSeenByUser,
    sendMessageByAdmin,
    getUnreadMessagesCount,
} = require('../../controllers/message.controller');
const { adminAuthentication, restrictTo } = require('../../middlewares/auth.admin.middleware');
const PERMISSIONS = require('../../config/permissions');
const { userAuthentication } = require('../../middlewares/auth.user.middleware');
const router = express.Router();
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
const sessionClient = new dialogflow.SessionsClient();
const projectId = 'ecommerce-cxlm';

router.post('/chatbot', async (req, res) => {
    const sessionId = uuid.v4();
    const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId); // Cập nhật tại đây

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: req.body.message,
                languageCode: 'vi',
            },
        },
    };

    try {
        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;
        res.send({ fulfillmentText: result.fulfillmentText });
    } catch (error) {
        console.error('Dialogflow error details:', error.message); // Ghi lại thông báo lỗi
        console.error('Error Stack:', error.stack); // Ghi lại thông tin chi tiết của lỗi

        res.status(500).send({ error: 'Error communicating with Dialogflow', details: error.message });
    }
});

// Gửi tin nhắn
router.get('/:conversationId', getMessagesByConversation);
router.post('/by-user', [userAuthentication], sendMessageByUSer);
router.patch('/seen-by-user/:conversationId', [userAuthentication], markMessagesAsSeenByUser);
router.get('/:conversationId/unread', [userAuthentication], getUnreadMessagesCount);
// Lấy tin nhắn theo conversationId
router.use(adminAuthentication);
router.use(restrictTo(PERMISSIONS.MESSAGE_MANAGE));
// Đánh dấu đã xem tin nhắn
router.patch('/seen-by-admin/:conversationId', markMessagesAsSeenByAdmin);
router.post('/by-admin', sendMessageByAdmin);
router.delete('/:id', deleteMessage);
module.exports = router;
