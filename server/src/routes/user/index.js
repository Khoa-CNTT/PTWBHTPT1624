const express = require('express');
const UserController = require('../../controllers/user.controller');
const asyncHandle = require('../../helper/asyncHandle');
const { adminAuthentication, restrictTo } = require('../../middlewares/auth.admin.middleware');
const PERMISSIONS = require('../../config/permissions');
const { userAuthentication } = require('../../middlewares/auth.user.middleware');

const router = express.Router();

// ✅ Xác thực trước khi truy cập API
router.put('/profile/update', [userAuthentication], asyncHandle(UserController.updateProfile));
// Thêm vào router trong user.router.js
router.post('/luckbox', [userAuthentication], asyncHandle(UserController.playLuckyBox));
router.get('/wheel/rewards', [userAuthentication], asyncHandle(UserController.getWheelRewards));
router.post('/vongquay', [userAuthentication], asyncHandle(UserController.vongquay)); // Thêm route chơi game Lucky Box
// Thêm route đổi mật khẩu
router.put('/change-password', [userAuthentication], asyncHandle(UserController.changePassword));
router.get('/profile', [userAuthentication], asyncHandle(UserController.getProfile));

router.use(adminAuthentication);
router.use(restrictTo(PERMISSIONS.ROLE_MANAGE));

router.get('/all', asyncHandle(UserController.getAllUsers));
router.post('/add', asyncHandle(UserController.addUser));
router.put('/:uid/update', asyncHandle(UserController.updateUser));
router.delete('/:uid/delete', asyncHandle(UserController.deleteUser));
router.put('/:uid/toggle-block', asyncHandle(UserController.toggleBlockUser));
router.get('/search', asyncHandle(UserController.searchUsers)); // Tìm kiếm theo tên hoặc email

module.exports = router;
