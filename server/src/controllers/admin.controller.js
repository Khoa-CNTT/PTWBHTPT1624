'use strict';

const AdminService = require('../services/admin.service');

class adminController {
    static async addAdmin(req, res) {
        const admin = await AdminService.addAdmin(req.body);
        res.status(201).json({
            success: true,
            message: 'Thêm người dùng thành công!',
            data: admin,
        });
    }

    static async updateAdmin(req, res) {
        const updatedAdmin = await AdminService.updateAdmin(req.params.uid, req.body);
        res.status(200).json({
            success: true,
            message: 'Cập nhật người dùng thành công!',
            data: updatedAdmin,
        });
    }

    static async deleteAdmin(req, res) {
        const deletedAdmin = await AdminService.deleteAdmin(req.params.uid);
        res.status(200).json({
            success: true,
            message: 'Xóa người dùng thành công!',
            data: deletedAdmin,
        });
    }

    static async getAllAdmins(req, res) {
        const admins = await AdminService.getAllAdmins({ admin_id: req.admin._id, ...req.query });
        res.status(200).json({
            success: true,
            message: 'Lấy danh sách người dùng thành công!',
            data: admins,
        });
    }

    static async getProfile(req, res) {
        const profile = await AdminService.getProfile(req.admin._id);
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
            data: await AdminService.updateProfile(req.admin._id, req.body),
        });
    }

    static async searchAdmins(req, res) {
        const { keyword } = req.query;
        const result = await AdminService.searchAdminsByNameOrEmail(keyword);
        res.status(200).json({
            success: true,
            message: 'Tìm kiếm người dùng thành công!',
            data: result,
        });
    }
}

module.exports = adminController;
