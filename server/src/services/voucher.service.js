"use strict";
const Voucher = require("../models/voucher.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const voucherModel = require("../models/voucher.model");

class VoucherService {
  // Tạo voucher mới
  static async createVoucher(payload) {
    if (
      !payload.voucher_name ||
      !payload.voucher_description ||
      !payload.voucher_start_date ||
      !payload.voucher_end_date ||
      !payload.voucher_method ||
      !payload.voucher_value ||
      !payload.voucher_max_uses ||
      !payload.voucher_max_uses_per_user ||
      !payload.voucher_min_order_value ||
      !payload.voucher_code
    ) {
      throw new BadRequestError("Thiếu thông tin bắt buộc!");
    }

    try {
      // Đảm bảo voucher_code là chuỗi hợp lệ
      if (typeof payload.voucher_code !== "string" || payload.voucher_code.trim() === "") {
        throw new BadRequestError("Mã voucher không hợp lệ!");
      }
      // Kiểm tra xem voucher_code đã tồn tại chưa
      const existingVoucher = await voucherModel.findOne({ voucher_code: payload.voucher_code });
      // Tạo voucher mới
      const voucher = await voucherModel.create(payload);
      return voucher;
    } catch (error) {
      throw error;
    }
  }

  // Lấy danh sách tất cả voucher
  static async getAllVouchers() {
    return await voucherModel.find();
  }

  // Lấy voucher theo ID
  static async getVoucherById(id) {
    const voucher = await voucherModel.findById(id);
    if (!voucher) throw new NotFoundError("Voucher không tồn tại!");
    return voucher;
  }

  // Cập nhật voucher theo ID
  static async updateVoucher(id, payload) {
    const updatedVoucher = await voucherModel.findByIdAndUpdate(id, payload, { new: true });
    if (!updatedVoucher) throw new NotFoundError("Voucher không tồn tại!");
    return updatedVoucher;
  }

  // Xóa voucher theo ID
  static async deleteVoucher(id) {
    const voucher = await voucherModel.findByIdAndDelete(id);
    if (!voucher) throw new NotFoundError("Voucher không tồn tại!");
    return voucher;
  }

  // 🔹 Tìm kiếm voucher theo tên
  static async searchVoucherByName(name) {
    const vouchers = await voucherModel.find({
      voucher_name: { $regex: new RegExp(name, "i") }
    });
    if (!vouchers.length) throw new NotFoundError("Không tìm thấy voucher phù hợp!");
    return vouchers;
  }
}

module.exports = VoucherService;
