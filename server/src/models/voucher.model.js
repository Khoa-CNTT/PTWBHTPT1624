'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const VoucherSchema = new Schema(
    {
        voucher_name: { type: String, required: true, unique: true }, // Tên voucher, phải duy nhất
        voucher_description: { type: String, required: true }, // Mô tả voucher
        voucher_code: { type: String, required: true, unique: true }, // Mã voucher, phải duy nhất
        voucher_type: { type: String, enum: ['system', 'user'], default: 'system' }, // "system" (hệ thống) hoặc "user" (do user đổi điểm)
        voucher_thumb: { type: String, required: true }, // Hình thumbnail
        voucher_banner_image: { type: String, required: true }, // Hình banner quảng cáo
        voucher_method: {
            type: String,
            enum: ['percent', 'fixed'],
            required: true,
        }, // "percent" hoặc "fixed"
        voucher_value: { type: Number, required: true }, // Giá trị giảm giá (VD: 10% hoặc 50,000 VND)
        voucher_start_date: { type: Date, required: true },
        voucher_end_date: { type: Date, required: true },
        voucher_max_uses: { type: Number, required: true }, // Số lần tối đa mã giảm giá có thể được sử dụng
        voucher_uses_count: { type: Number, default: 0 }, // Số lần đã sử dụng
        voucher_users_used: [{ type: String }], // danh sách người đã sử dụng
        voucher_max_price: { type: Number, default: null }, // Mức giảm tối đa (nếu là percent)
        voucher_min_order_value: { type: Number, required: true }, // Giá trị đơn hàng tối thiểu để áp dụng voucher
        voucher_is_active: { type: Boolean, default: true },
        voucher_required_points: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    },
);

// Kiểm tra trùng tên voucher trước khi lưu
VoucherSchema.pre('save', async function (next) {
    const existingVoucherByName = await mongoose.model('Voucher').findOne({ voucher_name: this.voucher_name });
    if (existingVoucherByName && existingVoucherByName._id.toString() !== this._id.toString()) {
        const error = new Error('Tên voucher đã tồn tại');
        error.status = 203; // Mã lỗi tùy chọn
        return next(error);
    }

    const existingVoucherByCode = await mongoose.model('Voucher').findOne({ voucher_code: this.voucher_code });
    if (existingVoucherByCode && existingVoucherByCode._id.toString() !== this._id.toString()) {
        const error = new Error('Mã voucher đã tồn tại');
        error.status = 203; // Mã lỗi tùy chọn
        return next(error);
    }

    next();
});

// Kiểm tra trùng tên voucher khi cập nhật
VoucherSchema.pre('findOneAndUpdate', async function (next) {
    const updatedVoucher = this._update;

    if (updatedVoucher.voucher_name) {
        const existingVoucherByName = await mongoose.model('Voucher').findOne({ voucher_name: updatedVoucher.voucher_name });
        if (existingVoucherByName && existingVoucherByName._id.toString() !== updatedVoucher._id.toString()) {
            const error = new Error('Tên voucher đã tồn tại');
            error.status = 203; // Mã lỗi tùy chọn
            return next(error);
        }
    }

    if (updatedVoucher.voucher_code) {
        const existingVoucherByCode = await mongoose.model('Voucher').findOne({ voucher_code: updatedVoucher.voucher_code });
        if (existingVoucherByCode && existingVoucherByCode._id.toString() !== updatedVoucher._id.toString()) {
            const error = new Error('Mã voucher đã tồn tại');
            error.status = 203; // Mã lỗi tùy chọn
            return next(error);
        }
    }

    next();
});

module.exports = mongoose.model('Voucher', VoucherSchema);
