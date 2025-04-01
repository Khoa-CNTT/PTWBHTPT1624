'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const Role = require('../models/role.model');

class RoleService {
    // Tạo vai trò mới
    static async createRole(payload) {
        const { role_name, role_permissions } = payload;
        if (!role_name || !role_permissions) {
            throw new BadRequestError('Vui lòng cung cấp đầy đủ thông tin vai trò');
        }
        // Kiểm tra xem role_name đã tồn tại chưa
        const existingRole = await Role.findOne({ role_name });
        if (existingRole) {
            throw new BadRequestError('Vai trò đã tồn tại');
        }
        return await Role.create({ role_name, role_permissions });
    }

    // Lấy danh sách tất cả vai trò (có phân trang)
    static async getAllRoles({ limit, page }) {
        if (!(limit && page)) {
            return await Role.find().sort({ createdAt: -1 }).lean();
        }
        const limitNum = parseInt(limit, 10); // Mặc định limit = 10
        const pageNum = parseInt(page, 10); // Mặc định page = 0
        const skipNum = pageNum * limitNum;
        const roles = await Role.find().sort({ createdAt: -1 }).skip(skipNum).limit(limitNum).lean();
        const totalRole = await Role.countDocuments();
        return {
            totalPage: Math.ceil(totalRole / limitNum) - 1 || 0, // Tổng số trang (0-based)
            currentPage: pageNum || 0,
            totalRole,
            roles,
        };
    }
    // Lấy vai trò theo ID
    static async getRoleById(roleId) {
        const role = await Role.findById(roleId);
        if (!role) throw new NotFoundError('Không tìm thấy vai trò');
        return role;
    }

    // Lấy vai trò theo tên
    static async getRoleByName(roleName) {
        if (!roleName) throw new BadRequestError('Vui lòng cung cấp tên vai trò');

        const role = await Role.findOne({ role_name: roleName });
        if (!role) throw new NotFoundError('Không tìm thấy vai trò');
        return role;
    }

    // Cập nhật vai trò
    static async updateRole(roleId, updateData) {
        const updatedRole = await Role.findByIdAndUpdate(roleId, updateData, { new: true });
        if (!updatedRole) throw new NotFoundError('Không tìm thấy vai trò để cập nhật');
        return updatedRole;
    }

    // Xóa vai trò
    static async deleteRole(roleId) {
        const deletedRole = await Role.findByIdAndDelete(roleId);
        if (!deletedRole) throw new NotFoundError('Không tìm thấy vai trò để xóa');
        return deletedRole;
    }
}

module.exports = RoleService;
