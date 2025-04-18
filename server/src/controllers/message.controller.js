const conversationModel = require('../models/conversation.model');
const messageModel = require('../models/message.model');

/**
 * @desc Gửi tin nhắn mới
 */
const sendMessageByUSer = async (req, res) => {
    const { conversationId, text } = req.body;
    const sender = req.user._id;
    const senderRole = 'User';
    if (!conversationId || !sender || !senderRole || !text) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin để gửi tin nhắn',
        });
    }
    try {
        const newMessage = new messageModel({ conversationId, sender, senderRole, text });
        const savedMessage = await newMessage.save();
        // Cập nhật thời gian cập nhật mới nhất cho cuộc trò chuyện
        await conversationModel.findByIdAndUpdate(conversationId, {
            updatedAt: Date.now(),
        });
        res.status(201).json({
            success: true,
            message: 'Gửi tin nhắn thành công',
            data: savedMessage,
        });
    } catch (err) {
        console.error('Lỗi khi gửi tin nhắn:', err);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi gửi tin nhắn',
        });
    }
};
const sendMessageByAdmin = async (req, res) => {
    const { conversationId, text } = req.body;
    const sender = req.admin._id;
    const senderRole = 'Admin';
    if (!conversationId || !sender || !senderRole || !text) {
        return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin để gửi tin nhắn',
        });
    }
    try {
        const newMessage = new messageModel({ conversationId, sender, senderRole, text });
        const savedMessage = await newMessage.save();
        // Cập nhật thời gian cập nhật mới nhất cho cuộc trò chuyện
        await conversationModel.findByIdAndUpdate(conversationId, {
            updatedAt: Date.now(),
        });
        res.status(201).json({
            success: true,
            message: 'Gửi tin nhắn thành công',
            data: savedMessage,
        });
    } catch (err) {
        console.error('Lỗi khi gửi tin nhắn:', err);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi gửi tin nhắn',
        });
    }
};
/**
 * @desc Lấy tất cả tin nhắn của 1 cuộc trò chuyện
 */
const getMessagesByConversation = async (req, res) => {
    const { conversationId } = req.params;
    try {
        const messages = await messageModel.getMessages(conversationId);
        res.status(200).json({
            success: true,
            message: 'Lấy danh sách tin nhắn thành công',
            data: messages,
        });
    } catch (err) {
        console.error('Lỗi khi lấy tin nhắn:', err);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy tin nhắn',
        });
    }
};

/**
 * @desc Đánh dấu đã đọc tất cả tin nhắn chưa đọc
 */
const markMessagesAsSeenByUser = async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.user._id;
    try {
        await Message.updateMany(
            {
                conversationId,
                sender: { $ne: userId },
                seen: false,
            },
            { seen: true },
        );

        res.status(200).json({
            success: true,
            message: 'Đã đánh dấu tất cả tin nhắn là đã đọc',
        });
    } catch (err) {
        console.error('Lỗi khi đánh dấu đã đọc:', err);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi đánh dấu đã đọc',
        });
    }
};
const markMessagesAsSeenByAdmin = async (req, res) => {
    const { conversationId } = req.params;
    const userId = req.admin._id;
    try {
        await Message.updateMany(
            {
                conversationId,
                sender: { $ne: userId },
                seen: false,
            },
            { seen: true },
        );

        res.status(200).json({
            success: true,
            message: 'Đã đánh dấu tất cả tin nhắn là đã đọc',
        });
    } catch (err) {
        console.error('Lỗi khi đánh dấu đã đọc:', err);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi đánh dấu đã đọc',
        });
    }
};
/**
 * @desc Xoá một tin nhắn
 */
const deleteMessage = async (req, res) => {
    const { id } = req.params;

    try {
        await Message.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Đã xoá tin nhắn thành công',
        });
    } catch (err) {
        console.error('Lỗi khi xoá tin nhắn:', err);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi xoá tin nhắn',
        });
    }
};

module.exports = {
    sendMessageByUSer,
    sendMessageByAdmin,
    getMessagesByConversation,
    markMessagesAsSeenByUser,
    markMessagesAsSeenByAdmin,
    deleteMessage,
};
