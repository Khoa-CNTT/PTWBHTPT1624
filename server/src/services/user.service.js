"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const voucherModel = require("../models/voucher.model");

class VoucherService {
    // Tạo voucher mới
    static async createVoucher(payload) {
        const {
            voucher_name,
            voucher_description,
            voucher_start_date,
            voucher_end_date,
            voucher_method,
            voucher_value,
            voucher_max_uses,
            voucher_max_uses_per_user,
            voucher_min_order_value,
            voucher_code,
        } = payload;

        // Kiểm tra dữ liệu đầu vào
        if (!voucher_name || !voucher_description || !voucher_start_date || !voucher_end_date ||
            !voucher_method || !voucher_value || !voucher_max_uses || !voucher_max_uses_per_user ||
            !voucher_min_order_value || !voucher_code) {
            throw new BadRequestError("Thiếu thông tin bắt buộc!");
        }

        // Kiểm tra voucher_code đã tồn tại chưa
        const existingVoucher = await voucherModel.findOne({ voucher_code });
        if (existingVoucher) {
            throw new BadRequestError("Voucher code đã tồn tại!");
        }

        // Tạo voucher mới
        return await voucherModel.create(payload);
    }

    // Lấy danh sách tất cả voucher
    static async getAllVouchers() {
        return await voucherModel.find();
    }

    // Lấy voucher theo ID
    static async getVoucherById(id) {
        const voucher = await voucherModel.findById(id);
        if (!voucher) {
            throw new NotFoundError("Voucher không tồn tại!");
        }
        return voucher;
    }

    // Cập nhật voucher theo ID
    static async updateVoucher(id, payload) {
        const updatedVoucher = await voucherModel.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
        });

        if (!updatedVoucher) {
            throw new NotFoundError("Voucher không tồn tại!");
        }
        return updatedVoucher;
    }

    // Xóa voucher theo ID
    static async deleteVoucher(id) {
        const voucher = await voucherModel.findByIdAndDelete(id);
        if (!voucher) {
            throw new NotFoundError("Voucher không tồn tại!");
        }
        return {
            _id: voucher._id,
            voucher_name: voucher.voucher_name,
            voucher_code: voucher.voucher_code
        };
    }

    // Tìm kiếm voucher theo tên
    static async searchVoucherByName(name) {
        const vouchers = await voucherModel.find({
            voucher_name: { $regex: new RegExp(name, "i") }
        });

        if (!vouchers.length) {
            throw new NotFoundError("Không tìm thấy voucher phù hợp!");
        }
        return vouchers;
    }
}

module.exports = VoucherService;
