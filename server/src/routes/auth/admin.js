const express = require("express");
const AuthAdminController = require("../../controllers/auth.admin.controller");
const asyncHandle = require("../../helper/asyncHandle");
const { adminAuthentication } = require("../../middlewares/auth.admin.middleware");

const router = express.Router();

// Đăng ký & đăng nhập
router.post("/login", asyncHandle(AuthAdminController.adminLogin));
router.post("/refreshToken", asyncHandle(AuthAdminController.refreshToken));
router.use(adminAuthentication);
router.post("/logout", asyncHandle(AuthAdminController.adminLogout));


module.exports = router;