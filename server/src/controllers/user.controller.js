'use strict';

const UserService = require('../services/user.service');

class UserController {
    static async addUser(req, res) {
        const user = await UserService.addUser(req.body);
        res.status(201).json({
            success: true,
            message: 'Thêm người dùng thành công!',
            data: user,
        });
    }

    static async updateUser(req, res) {
        const updatedUser = await UserService.updateUserByAdmin(req.params.uid, req.body);
        res.status(200).json({
            success: true,
            message: 'Cập nhật người dùng thành công!',
            data: updatedUser,
        });
    }

    static async deleteUser(req, res) {
        const deletedUser = await UserService.deleteUser(req.params.uid);
        res.status(200).json({
            success: true,
            message: 'Xóa người dùng thành công!',
            data: deletedUser,
        });
    }

    static async toggleBlockUser(req, res) {
        const { isBlocked } = req.body;
        if (typeof isBlocked !== 'boolean') {
            return res.status(400).json({ success: false, message: 'Trạng thái chặn không hợp lệ!' });
        }
        const message = await UserService.toggleBlockUser(req.params.uid, isBlocked);
        res.status(200).json({
            success: true,
            message: message,
        });
    }

    static async getAllUsers(req, res) {
        const users = await UserService.getAllUsers(req.query);
        res.status(200).json({
            success: true,
            message: 'Lấy danh sách người dùng thành công!',
            data: users,
        });
    }

    static async getProfile(req, res) {
        const profile = await UserService.getProfile(req.user._id);
        res.status(200).json({
            success: true,
            message: 'Lấy thông tin cá nhân thành công!',
            data: profile,
        });
    }

    static async updateProfile(req, res) {
        res.status(200).json({
            success: true,
            message: 'Cập nhật thông tin cá nhân thành công',
            data: await UserService.updateProfile(req.user._id, req.body),
        });
    }
    static async searchUsers(req, res) {
        try {
            const users = await UserService.searchUsers(req.query);
            res.status(200).json({
                success: true,
                message: 'Tìm kiếm người dùng thành công!',
                data: users,
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Lỗi hệ thống!',
            });
        }
    }
    static async changePassword(req, res, next) {
        try {
            const { oldPassword, newPassword } = req.body;
            const uid = req.user._id; // Giả sử user đã đăng nhập và UID có sẵn trong `req.user`
            const result = await UserService.changePassword(uid, oldPassword, newPassword);
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
    static async playLuckyBox(req, res) {
        try {
            const userId = req.user._id;
            const result = await UserService.playLuckyBox(userId);
            res.status(200).json({
                success: true,
                message: 'Chúc mừng bạn đã nhận phần thưởng!',
                data: result,
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Lỗi hệ thống!',
            });
        }
    }
    // Chơi game Lucky Box
    static async vongquay(req, res) {
        try {
            const userId = req.user._id;
            const result = await UserService.vongquay(userId);

            let message = 'Chúc mừng bạn đã nhận phần thưởng!';
            if (result.type === 'points') {
                message = `Bạn đã nhận ${result.value} điểm thưởng!`;
            } else if (result.type === 'voucher') {
                message = `Bạn đã nhận voucher: ${result.voucher.voucher_name}`;
            }

            res.status(200).json({
                success: true,
                message,
                data: result,
            });
        } catch (error) {
            res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || 'Lỗi hệ thống!',
            });
        }
    }

}

module.exports = UserController;
