'use strict';
const UserVoucherService = require('../services/userVoucher.service');

const UserVoucherController = {
    // Lưu voucher vào tài khoản người dùng
    saveVoucherForUser: async (req, res) => {
        const { voucherId } = req.body;
        const vouchers = await UserVoucherService.saveVoucherForUser(req.user._id, voucherId);
        res.status(200).json({
            success: true,
            data: vouchers,
            message: 'Lưu voucher vào tài khoản thành công!',
        });
    },

    // Đổi voucher bằng điểm tích lũy
    redeemVoucher: async (req, res) => {
        const { voucherId } = req.body;
        const vouchers = await UserVoucherService.redeemVoucher(req.user._id, voucherId);
        res.status(200).json({
            success: true,
            data: vouchers,
            message: 'Đổi voucher bằng điểm thành công!',
        });
    },

    // Lấy tất cả voucher đã lưu của người dùng
    getVoucherByUser: async (req, res) => {
        const vouchers = await UserVoucherService.getVoucherByUser(req.user._id);
        res.status(200).json({
            success: true,
            data: vouchers,
            message: 'Lấy danh sách voucher của người dùng thành công!',
        });
    },
};

module.exports = UserVoucherController;
