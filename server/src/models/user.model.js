const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        user_reward_points: { type: Number, default: 0 }, // Điểm tích lũy khi đánh giá sản phẩm thành công
        user_name: { type: String, default: '' },
        user_email: { type: String, required: true, unique: true },
        user_password: { type: String },
        user_address: {
            village: { type: String, default: '' },
            district: { type: String, default: '' },
            city: { type: String, default: '' },
            detail: { type: String, default: '' },
        },
        user_mobile: { type: String, unique: true },
        user_avatar_url: { type: String },
        user_passwordChangedAt: { type: Date },
        user_passwordResetToken: { type: String },
        user_passwordTokenExpires: { type: String },
        user_isBlocked: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);
userSchema.index(
    { user_mobile: 1 },
    {
        unique: true,
        partialFilterExpression: { user_mobile: { $ne: '' } },
    },
);

module.exports = mongoose.model('User', userSchema);
