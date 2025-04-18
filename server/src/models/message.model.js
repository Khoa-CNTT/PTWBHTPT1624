const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'senderRole', // Dynamic reference based on senderRole
        },
        senderRole: {
            type: String,
            enum: ['Admin', 'User'],
            required: true,
        },
        image: {
            type: String,
            default: '',
        },
        text: {
            type: String,
            required: true,
        },
        seen: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

// Custom static method to handle population
MessageSchema.statics.getMessages = async function (conversationId) {
    return await this.find({ conversationId }).sort({ createdAt: 1 }).populate({
        path: 'sender',
        select: 'user_avatar_url user_name admin_avatar_url admin_name', // Include all possible fields
    });
};

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;

// Usage
