const conversationModel = require('../models/conversation.model');

/**
 * @desc Tạo cuộc trò chuyện mới
 */
const createConversation = async (req, res) => {
    const userId = req.user._id;

    // Kiểm tra xem userId có hợp lệ không
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'Người dùng không hợp lệ',
        });
    }

    try {
        // Kiểm tra xem người dùng đã có cuộc trò chuyện nào chưa
        const existingConversation = await conversationModel.findOne({ user: userId });

        if (existingConversation) {
            return res.status(400).json({
                success: false,
                message: 'Người dùng đã có một cuộc trò chuyện',
            });
        }

        // Tạo cuộc trò chuyện mới
        const newConversation = new conversationModel({
            user: userId, // người tạo cuộc trò chuyện
            participants: [userId], // người tham gia cuộc trò chuyện (chỉ có userId ban đầu)
        });

        // Lưu cuộc trò chuyện vào cơ sở dữ liệu
        const savedConversation = await newConversation.save();

        return res.status(201).json({
            success: true,
            message: 'Tạo cuộc trò chuyện thành công',
            data: savedConversation,
        });
    } catch (err) {
        console.error('Lỗi khi tạo cuộc trò chuyện:', err);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi tạo cuộc trò chuyện',
        });
    }
};

/**
 * @desc Lấy tất cả cuộc trò chuyện của người dùng
 */
const getConversationUser = async (req, res) => {
    try {
        // Lấy cuộc trò chuyện của người dùng hiện tại
        const conversation = await conversationModel
            .findOne({ user: req.user._id })
            .populate('participants', 'admin_avatar_url  admin_name ')
            .populate('participants', 'user_avatar_url  user_name') // Lấy thông tin của admin
            .sort({ createdAt: -1 });
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Không có cuộc trò chuyện nào',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Lấy cuộc trò chuyện thành công',
            data: conversation,
        });
    } catch (err) {
        console.error('Lỗi khi lấy cuộc trò chuyện:', err);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy cuộc trò chuyện',
        });
    }
};
const getAllConversations = async (req, res) => {
    try {
        // Lấy cuộc trò chuyện của người dùng hiện tại
        const conversation = await conversationModel.find().populate('user', 'user_avatar_url  user_name ').sort({ createdAt: -1 });
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: 'Không có cuộc trò chuyện nào',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Lấy cuộc trò chuyện thành công',
            data: conversation,
        });
    } catch (err) {
        console.error('Lỗi khi lấy cuộc trò chuyện:', err);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy cuộc trò chuyện',
        });
    }
};
/**
 * @desc Cập nhật cuộc trò chuyện (thêm người tham gia)
 */
const addAdminToConversation = async (req, res) => {
    const { conversationId } = req.params;
    const adminId = req.admin._id; // danh sách người tham gia mới
    if (!adminId) {
        return res.status(400).json({
            success: false,
            message: 'Người tham gia mới không hợp lệ',
        });
    }
    try {
        // Cập nhật cuộc trò chuyện, thêm người tham gia
        const updatedConversation = await conversationModel
            .findByIdAndUpdate(conversationId, { $push: { participants: { $each: adminId } } }, { new: true })
            .populate('participants', 'user_avatar_url  user_name')
            .populate('participants', 'admin_avatar_url  admin_name');
        if (!updatedConversation) {
            return res.status(404).json({
                success: false,
                message: 'Cuộc trò chuyện không tồn tại',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Thêm người tham gia vào cuộc trò chuyện thành công',
            data: updatedConversation,
        });
    } catch (err) {
        console.error('Lỗi khi thêm người tham gia vào cuộc trò chuyện:', err);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi thêm người tham gia vào cuộc trò chuyện',
        });
    }
};

/**
 * @desc Xoá cuộc trò chuyện
 */
const deleteConversation = async (req, res) => {
    const { conversationId } = req.params;
    try {
        const deletedConversation = await conversationModel.findByIdAndDelete(conversationId);
        if (!deletedConversation) {
            return res.status(404).json({
                success: false,
                message: 'Cuộc trò chuyện không tồn tại',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Xoá cuộc trò chuyện thành công',
        });
    } catch (err) {
        console.error('Lỗi khi xoá cuộc trò chuyện:', err);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi xoá cuộc trò chuyện',
        });
    }
};

module.exports = {
    createConversation,
    getAllConversations,
    getConversationUser,
    addAdminToConversation,
    deleteConversation,
};
