"use strict";

const { BadRequestError, NotFoundError, ConflictRequestError } = require("../core/error.response");
const userModel = require("../models/user.model");
const voucherModel = require("../models/voucher.model");
const userVoucherModel = require("../models/userVoucher.model"); // Thêm đúng model

class userVoucherService {

    // Lưu voucher cho user
    // Lưu voucher cho user
static async saveVoucherForUser(userId, voucherId) {
    if (!userId || !voucherId) {
        throw new BadRequestError("Thiếu thông tin người dùng hoặc voucher!");
    }

    // Kiểm tra voucher có tồn tại và còn hạn không
    const voucher = await voucherModel.findOne({
        _id: voucherId,
        voucher_end_date: { $gte: new Date() }, // Voucher còn hạn
        voucher_is_active: true, // Voucher đang hoạt động
    });

    if (!voucher) {
        throw new NotFoundError("Voucher không tồn tại hoặc đã hết hạn!");
    }

    // Kiểm tra xem user đã có danh sách voucher chưa
    let userVouchers = await userVoucherModel.findOne({ vc_user_id: userId });

    if (!userVouchers) {
        // Nếu chưa có, tạo mới danh sách voucher cho user
        userVouchers = await userVoucherModel.create({
            vc_user_id: userId,
            vc_vouchers: [voucherId],
        });
    } else {
        // Kiểm tra xem voucher đã được lưu chưa
        if (userVouchers.vc_vouchers.includes(voucherId)) {
            throw new ConflictRequestError("Voucher đã được lưu trước đó!");
        }

        // Thêm voucher vào danh sách của user
        userVouchers.vc_vouchers.push(voucherId);
        await userVouchers.save();
    }

    return { message: "Voucher đã được lưu thành công!" };
}


    // Đổi voucher
    static async redeemVoucher(userId, voucherId) {
        try {
            if (!userId || !voucherId) return { error: "Vui lòng cung cấp thông tin" };
            const user = await userModel.findById(userId);
            const voucher = await voucherModel.findById(voucherId);
            if (!user) return { error: "Không tìm thấy người dùng" };
            if (!voucher) return { error: "Không tìm thấy voucher" };
            if (!voucher.voucher_is_active) return { error: "Voucher này hiện không hoạt động" };
            
            const currentDate = new Date();
            if (currentDate < voucher.voucher_start_date || currentDate > voucher.voucher_end_date) {
                return { error: "Voucher đã hết hạn sử dụng" };
            }
            
            const existingVoucher = await userVoucherModel.findOne({
                vc_user_id: userId,
                vc_vouchers: voucherId
            });
            if (existingVoucher) return { error: "Bạn đã sở hữu voucher này" };
            
            const userVoucherCount = voucher.voucher_users_used.filter(
                userUsedId => userUsedId.toString() === userId.toString()
            ).length;
            if (userVoucherCount >= voucher.voucher_max_uses_per_user) {
                return { error: "Bạn đã đạt giới hạn số lần sử dụng voucher này" };
            }
            
            if (user.user_reward_points < voucher.voucher_required_points) {
                return { error: `Không đủ điểm để đổi voucher. Cần ${voucher.voucher_required_points} điểm` };
            }
            
            user.user_reward_points -= voucher.voucher_required_points;
            await userVoucherModel.findOneAndUpdate(
                { vc_user_id: userId },
                { $push: { vc_vouchers: voucherId } },
                { new: true, upsert: true }
            );
            await user.save();
            return { message: "Đổi voucher thành công" };
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }

    // Lấy danh sách voucher của user
    static async getVoucherByUser(userId) {
        try {
            if (!userId) return { error: "Thiếu thông tin người dùng" };
            const userVouchers = await userVoucherModel.findOne({ vc_user_id: userId }).populate("vc_vouchers");
            if (!userVouchers || userVouchers.vc_vouchers.length === 0) {
                return { error: "Người dùng chưa có voucher nào" };
            }
            return userVouchers.vc_vouchers.map(voucher => ({
                voucherId: voucher._id,
                voucherName: voucher.voucher_name,
                voucherCode: voucher.voucher_code,
                voucherValue: voucher.voucher_value,
                voucherType: voucher.voucher_method,
                expirationDate: voucher.voucher_end_date
            }));
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }

    // Lấy danh sách voucher còn hạn của user
    static async getVouchersByUser(userId) {
        try {
            if (!userId) return { error: "Thiếu thông tin người dùng" };
            const userVouchers = await userVoucherModel
                .findOne({ vc_user_id: userId })
                .populate({
                    path: "vc_vouchers",
                    match: { voucher_end_date: { $gte: new Date() } },
                });
            if (!userVouchers || userVouchers.vc_vouchers.length === 0) {
                return { error: "Người dùng chưa có voucher nào còn hạn" };
            }
            return userVouchers.vc_vouchers;
        } catch (error) {
            console.error(error);
            return { error: error.message };
        }
    }
}

module.exports = userVoucherService;