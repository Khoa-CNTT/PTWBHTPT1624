const conversationModel = require('../models/conversation.model');
const User = require('../models/user.model');
const { BadRequestError } = require('../core/error.response');

const createConversation = async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: 'Người dùng không hợp lệ',
        });
    }
    try {
        // Kiểm tra xem đã có cuộc trò chuyện chưa
        let conversation = await conversationModel.findOne({ user: userId });

        if (conversation) {
            // Nếu đã có, trả về cuộc trò chuyện đó
            return res.status(200).json({
                success: true,
                data: conversation,
            });
        }

        // Nếu chưa có, tạo mới
        const newConversation = new conversationModel({
            user: userId,
            participants: [userId],
        });
        conversation = await newConversation.save();
        return res.status(201).json({
            success: true,
            message: 'Tạo cuộc trò chuyện thành công',
            data: conversation,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi tạo cuộc trò chuyện',
        });
    }
};
/**
 * @desc Lấy tất cả cuộc trò chuyện
 */
const getAllConversations = async (req, res) => {
    try {
        // Lấy tất cả cuộc trò chuyện
        const conversation = await conversationModel.find().populate('user', 'user_avatar_url user_name').sort({ createdAt: -1 });
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
    const adminId = req.admin._id; // người tham gia mới
    if (!adminId) {
        return res.status(400).json({
            success: false,
            message: 'Người tham gia mới không hợp lệ',
        });
    }
    try {
        // Cập nhật cuộc trò chuyện, thêm người tham gia
        const updatedConversation = await conversationModel
            .findByIdAndUpdate(conversationId, { $push: { participants: adminId } }, { new: true })
            .populate('participants', 'user_avatar_url user_name')
            .populate('participants', 'admin_avatar_url admin_name');
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

/**
 * @desc Tìm cuộc hội thoại theo tên người dùng
 */
const getConversationByUserName = async (req, res) => {
    const { name } = req.query;

    if (!name) throw new BadRequestError('Thiếu tên người dùng');

    const user = await User.findOne({ user_name: { $regex: name, $options: 'i' } });
    if (!user) throw new BadRequestError('Không tìm thấy người dùng');

    const conversation = await conversationModel.findOne({ user: user._id }).populate('user', 'user_name user_email').populate('participants');

    if (!conversation) throw new BadRequestError('Không tìm thấy cuộc hội thoại');

    return res.status(200).json({
        success: true,
        data: conversation,
    });
};

module.exports = {
    getConversationByUserName,
    createConversation,
    getAllConversations,
    addAdminToConversation,
    deleteConversation,
};
