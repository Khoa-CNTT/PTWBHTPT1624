'use strict';

const express = require('express');
const asyncHandle = require('../../helper/asyncHandle');
const { adminAuthentication, restrictTo } = require('../../middlewares/auth.admin.middleware');
const PERMISSIONS = require('../../config/permissions');
const RoleController = require('../../controllers/role.controller');

const router = express.Router();

// Lấy danh sách vai trò (có phân trang)
router.get('/all', asyncHandle(RoleController.getAllRoles));
// Lấy vai trò theo ID
router.get('/:id/search', asyncHandle(RoleController.getRoleById));
// Lấy vai trò theo tên
router.get('/search', asyncHandle(RoleController.getRoleByName));
// =============== ADMIN ===============
router.use(adminAuthentication);
router.use(restrictTo(PERMISSIONS.ROLE_MANAGE));
// Tạo vai trò mới
router.post('/add', asyncHandle(RoleController.createRole));

// Cập nhật vai trò
router.put('/:id/update', asyncHandle(RoleController.updateRole));

// Xóa vai trò
router.delete('/:id/delete', asyncHandle(RoleController.deleteRole));

module.exports = router;
