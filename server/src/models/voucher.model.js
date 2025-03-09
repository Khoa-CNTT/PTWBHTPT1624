"use strict";

const mongoose = require('mongoose');
const { Schema } = mongoose;

const VoucherSchema = new Schema({
    voucher_name: { type: String, required: true, unique: true },  
    voucher_code: { type: String, required: true, unique: true }, // 🔹 Bổ sung voucher_code
    voucher_description: { type: String, required: true },
    voucher_type: { type: String, enum: ["system", "user"], default: "system" },
    voucher_thumb: { type: String, required: true },
    voucher_banner_image: { type: String, required: true },
    voucher_method: { type: String, enum: ["percent", "fixed"], required: true },
    voucher_value: { type: Number, required: true },
    voucher_start_date: { type: Date, required: true },
    voucher_end_date: { type: Date, required: true },
    voucher_max_uses: { type: Number, required: true },
    voucher_uses_count: { type: Number, default: 0 },
    voucher_max_uses_per_user: { type: Number, required: true },
    voucher_users_used: [{ type: String }],
    voucher_max_price: { type: Number, default: null },
    voucher_min_order_value: { type: Number, required: true },
    voucher_is_active: { type: Boolean, default: true },
    voucher_required_points: { type: Number, default: 0 }
}, {
    timestamps: true
});

// 🔍 Middleware kiểm tra trùng lặp voucher_code & voucher_name
const checkVoucherUnique = async function (next) {
    try {
        const voucher = this instanceof mongoose.Document ? this : this.getUpdate(); // Xác định kiểu dữ liệu

        if (!voucher.voucher_name || !voucher.voucher_code) {
            return next(); // Nếu không có voucher_name hoặc voucher_code, bỏ qua kiểm tra
        }

        const query = {
            $or: [
                { voucher_name: voucher.voucher_name },
                { voucher_code: voucher.voucher_code }
            ]
        };

        if (this instanceof mongoose.Query) {
            query._id = { $ne: this.getQuery()._id }; // Nếu update, bỏ qua chính nó
        } else if (voucher._id) {
            query._id = { $ne: voucher._id }; // Nếu là document, cũng bỏ qua chính nó
        }

        const existingVoucher = await mongoose.model('Voucher').findOne(query);

        if (existingVoucher) {
            return next(new Error(existingVoucher.voucher_name === voucher.voucher_name ? 
                "Voucher name đã tồn tại!" : "Voucher code đã tồn tại!"));
        }

        next(); // Không có lỗi thì tiếp tục
    } catch (error) {
        next(error);
    }
};

// 🔹 Chỉ áp dụng middleware khi tạo mới hoặc update voucher_name, voucher_code
VoucherSchema.pre('save', checkVoucherUnique);
VoucherSchema.pre('findOneAndUpdate', checkVoucherUnique);
VoucherSchema.pre('updateOne', checkVoucherUnique);

module.exports = mongoose.model('Voucher', VoucherSchema);
