const express = require('express');
const AuthUserController = require('../../controllers/auth.user.controller');
const asyncHandle = require('../../helper/asyncHandle');
const { userAuthentication } = require('../../middlewares/auth.user.middleware');

const router = express.Router();

// Xác thực email khi đăng ký
router.post('/email/send-verification', asyncHandle(AuthUserController.sendVerificationEmail));
router.put('/email/verify', asyncHandle(AuthUserController.confirmVerificationEmail));
// Đăng ký & đăng nhập
router.post('/signup', asyncHandle(AuthUserController.userSignup));
router.post('/login', asyncHandle(AuthUserController.userLogin));
router.post('/refreshToken', asyncHandle(AuthUserController.refreshToken));
// Chức năng quên mật khẩu
router.post('/email/send-forgot-password', asyncHandle(AuthUserController.forgotPassword)); // Gửi mã
router.put('/reset_password', asyncHandle(AuthUserController.resetPassword));
router.put('/login_google', asyncHandle(AuthUserController.loginGoogle));

// Yêu cầu userAuthentication mới có thể logout
router.use(userAuthentication);
router.post('/logout', asyncHandle(AuthUserController.userLogout));
router.put('/change-password', asyncHandle(AuthUserController.changePassword));

module.exports = router;
