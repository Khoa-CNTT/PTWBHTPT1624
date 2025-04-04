"use strict";
const Voucher = require("../models/voucher.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const voucherModel = require("../models/voucher.model");
const autoCode = require("../utils/autoCode");

class VoucherService {
  // Tạo voucher mới
  static async createVoucher(payload) {
    // Kiểm tra các trường bắt buộc
    if (
      !payload.voucher_name ||
      !payload.voucher_description ||
      !payload.voucher_start_date ||
      !payload.voucher_end_date ||
      !payload.voucher_method ||
      !payload.voucher_value ||
      !payload.voucher_max_uses ||
      !payload.voucher_min_order_value
    ) {
      throw new BadRequestError("Thiếu thông tin bắt buộc!");
    }
    // Kiểm tra tên voucher có bị trùng không
    const existingVoucher = await voucherModel.findOne({
      voucher_name: payload.voucher_name,
    });
    if (existingVoucher) {
      throw new BadRequestError("Tên voucher code đã tồn tại!");
    }
    // Kiểm tra định dạng ngày bắt đầu và ngày hết hạn
    const startDate = new Date(payload.voucher_start_date);
    const endDate = new Date(payload.voucher_end_date);
    if (startDate >= endDate) {
      throw new BadRequestError("Ngày hết hạn phải sau ngày bắt đầu!");
    }
    // Kiểm tra giá trị voucher hợp lệ (giá trị voucher và giá trị đơn hàng tối thiểu phải lớn hơn 0)
    if (payload.voucher_value <= 0) {
      throw new BadRequestError("Giá trị voucher phải lớn hơn 0!");
    }
    if (payload.voucher_min_order_value <= 0) {
      throw new BadRequestError("Giá trị đơn hàng tối thiểu phải lớn hơn 0!");
    }
    // Tạo voucher mới
    const voucher = await voucherModel.create({
      ...payload,
      voucher_code: autoCode(payload.voucher_name),
    });
    return voucher;
  }

  // Lấy danh sách tất cả voucher
  static async getAllVouchers({ limit, page }) {
    const limitNum = parseInt(limit, 10); // Mặc định limit = 10
    const pageNum = parseInt(page, 10); // Mặc định page = 0
    const skipNum = pageNum * limitNum;
    const vouchers = await voucherModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skipNum)
      .select("-__v -createdAt -updatedAt")
      .limit(limitNum)
      .lean();
    const totalVoucher = await voucherModel.countDocuments();
    return {
      totalPage: Math.ceil(totalVoucher / limitNum) - 1 || 0, // Tổng số trang (0-based)
      currentPage: pageNum || 0,
      totalVoucher,
      vouchers,
    };
  }

  // Lấy voucher theo ID
  static async getVoucherById(id) {
    const voucher = await voucherModel.findById(id);
    if (!voucher) throw new NotFoundError("Voucher không tồn tại!");
    return voucher;
  }

  // Cập nhật voucher theo ID
  static async updateVoucher(id, payload) {
    // Kiểm tra tên voucher có bị trùng không
    const existingVoucher = await voucherModel.findOne({
      voucher_name: payload.voucher_name,
    });
    if (existingVoucher) {
      throw new BadRequestError("Tên voucher code đã tồn tại!");
    }
    const updatedVoucher = await voucherModel.findByIdAndUpdate(
      id,
      { ...payload, voucher_code: autoCode(payload.voucher_name) },
      { new: true }
    );
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
      voucher_name: { $regex: new RegExp(name, "i") },
    });
    if (!vouchers.length)
      throw new NotFoundError("Không tìm thấy voucher phù hợp!");
    return vouchers;
  }
}

module.exports = VoucherService;
