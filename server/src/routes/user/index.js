const express = require('express');
const UserController = require('../../controllers/user.controller');
const asyncHandle = require('../../helper/asyncHandle');
const { adminAuthentication, restrictTo } = require('../../middlewares/auth.admin.middleware');
const PERMISSIONS = require('../../config/permissions');
const { userAuthentication } = require('../../middlewares/auth.user.middleware');

const router = express.Router();

// ✅ Xác thực trước khi truy cập API
router.get('/profile', [userAuthentication], asyncHandle(UserController.getProfile));
router.put('/profile/update', [userAuthentication], asyncHandle(UserController.updateProfile));

router.use(adminAuthentication);
router.use(restrictTo(PERMISSIONS.ROLE_MANAGE));

router.get('/all', asyncHandle(UserController.getAllUsers));
router.post('/add', asyncHandle(UserController.addUser));
router.put('/:uid/update', asyncHandle(UserController.updateUser));
router.delete('/:uid/delete', asyncHandle(UserController.deleteUser));
router.put('/:uid/toggle-block', asyncHandle(UserController.toggleBlockUser));
router.get('/search', asyncHandle(UserController.searchUsers));  // Tìm kiếm theo tên hoặc email




module.exports = router;
