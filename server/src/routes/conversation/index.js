const express = require('express');
const {
    createConversation,
    getConversationUser,
    getAllConversations,
    deleteConversation,
    addAdminToConversation,
} = require('../../controllers/conversation.controller');
const { adminAuthentication, restrictTo } = require('../../middlewares/auth.admin.middleware');
const PERMISSIONS = require('../../config/permissions');
const { userAuthentication } = require('../../middlewares/auth.user.middleware');

const router = express.Router();

// Route tạo cuộc trò chuyện mới
router.post('/create', [userAuthentication], createConversation);
// Route lấy tất cả cuộc trò chuyện của người dùng
router.get('/user', [userAuthentication], getConversationUser);
// Route lấy tất cả cuộc trò chuyện

router.use(adminAuthentication);
router.use(restrictTo(PERMISSIONS.MESSAGE_MANAGE));
// lấy tất cả cuộc hội thoại
router.get('/', getAllConversations);
// Route thêm admin tham gia vào cuộc trò chuyện
router.put('/:conversationId/add-admin', addAdminToConversation);
// Route xóa cuộc trò chuyện
router.delete('/:conversationId', deleteConversation);

module.exports = router;
