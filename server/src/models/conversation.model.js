const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true, // Một người dùng chỉ có một cuộc hội thoại duy nhất
        },
        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User', // Người dùng tham gia cuộc trò chuyện
            },
            {
                type: Schema.Types.ObjectId,
                ref: 'Admin', // Admin tham gia cuộc trò chuyện
            },
        ],
        seen: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model('Conversation', conversationSchema);
