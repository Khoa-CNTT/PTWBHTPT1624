'use strict';

const RoleService = require('../services/role.service');

class RoleController {
    // Tạo vai trò mới
    static async createRole(req, res, next) {
        const role = await RoleService.createRole(req.body);
        res.status(201).json({ success: true, message: 'Tạo vai trò thành công', role });
    }
    // Lấy danh sách vai trò (có phân trang)
    static async getAllRoles(req, res, next) {
        const roles = await RoleService.getAllRoles(req.query);
        res.status(200).json({ success: true, data: roles });
    }

    // Lấy vai trò theo ID
    static async getRoleById(req, res, next) {
        const role = await RoleService.getRoleById(req.params.id);
        res.status(200).json(role);
    }

    // Cập nhật vai trò
    static async updateRole(req, res, next) {
        const role = await RoleService.updateRole(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Cập nhật vai trò thành công', role });
    }

    // Xóa vai trò
    static async deleteRole(req, res, next) {
        await RoleService.deleteRole(req.params.id);
        res.status(200).json({ success: true, message: 'Xóa vai trò thành công' });
    }

    // Lấy vai trò theo tên
    static async getRoleByName(req, res, next) {
        const role = await RoleService.getRoleByName(nareq.queryme);
        res.json(role);
    }
}

module.exports = RoleController;
