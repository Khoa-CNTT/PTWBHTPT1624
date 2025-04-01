"use strict";
const AuthAdminService = require("../services/auth.admin.service");

class AuthAdminController {
    static async adminLogin(req, res) {
        const access_token = await AuthAdminService.adminLogin(req.body, res);
        return res.status(200).json({
            success: true,
            data: { access_token },
            message: "Đăng nhập thành công!"
        });
    }
    static async adminLogout(req, res) {
        await AuthAdminService.adminLogout(res);
        return res.status(200).json({
            success: true,
            message: "Đăng xuất thành công!"
        });
    }
    static async refreshToken(req, res) {
        const { ad_rf } = req.cookies
        const access_token = await AuthAdminService.handleRefreshToken(ad_rf, res);
        return res.status(200).json({
            success: true,
            data: { access_token },
            message: "Thành công!"
        });
    }
}

module.exports = AuthAdminController;
