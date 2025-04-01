"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

const VoucherSchema = new Schema(
  {
    voucher_name: { type: String, required: true, unique: true }, // Tên voucher, phải duy nhất
    voucher_description: { type: String, required: true }, // Mô tả voucher
    voucher_code: { type: String, required: true, unique: true }, // Mã voucher, phải duy nhất
    voucher_type: { type: String, enum: ["system", "user"], default: "system" }, // "system" (hệ thống) hoặc "user" (do user đổi điểm)
    voucher_thumb: { type: String, required: true }, // Hình thumbnail
    voucher_banner_image: { type: String, required: true }, // Hình banner quảng cáo
    voucher_method: {
      type: String,
      enum: ["percent", "fixed"],
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
  }
);

module.exports = mongoose.model("Voucher", VoucherSchema);
