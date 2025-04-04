const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        user_reward_points: { type: Number, default: 0 }, // Điểm tích lũy khi đánh giá sản phẩm thành công
        user_name: { type: String, default: '' },
        user_email: { type: String, required: true, unique: true },
        user_password: { type: String },
        user_address: { type: String },
        user_mobile: { type: String, unique: true },
        user_avatar_url: { type: String },
        user_passwordChangedAt: { type: Date },
        user_isBlocked: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('User', userSchema);
