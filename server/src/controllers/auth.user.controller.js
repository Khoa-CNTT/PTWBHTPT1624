"use strict";

const AuthUserService = require("../services/auth.user.service");


class AuthUserController {
    // Gửi token xác nhận email
    static async sendVerificationEmail(req, res) {
        await AuthUserService.sendVerificationEmail(req.body);
        return res.status(200).json({
            success: true,
            message: "Mã xác thực đã được gửi thành công!"
        });

    }
    // Xác nhận email bằng token
    static async confirmVerificationEmail(req, res) {
        await AuthUserService.confirmVerificationEmail(req.body);
        return res.status(200).json({
            success: true,
            message: "Email xác thực thành công!"
        });
    }
    // thực hiện đăng ký khi xác thực thành công
    static async userSignup(req, res) {
        const access_token = await AuthUserService.userSignup(req.body, res);
        return res.status(200).json({
            success: true,
            data: { access_token },
            message: "Đăng nhập thành công!"
        });
    }
    static async userLogin(req, res) {
        const access_token = await AuthUserService.userLogin(req.body, res);
        return res.status(200).json({
            success: true,
            data: { access_token },
            message: "Đăng nhập thành công!"
        });
    }
    static async userLogout(req, res) {
        await AuthUserService.userLogout(res);
        return res.status(200).json({
            success: true,
            message: "Đăng xuất thành công!"
        });
    }
    static async refreshToken(req, res) {
        const { refresh_token } = req.cookies
        const access_token = await AuthUserService.handleRefreshToken(refresh_token, res);
        return res.status(200).json({
            success: true,
            data: { access_token },
            message: "Thành công!"
        });
    }

    // Gửi mã xác nhận quên mật khẩu
    static async forgotPassword(req, res) {
        const response = await AuthUserService.forgotPassword(req.body);
        res.json(response);
    }

    // Xác nhận mã quên mật khẩu
    static async verifyResetCode(req, res) {
        const response = await AuthUserService.verifyResetCode(req.body);
        res.json(response);
    }

    // Đổi mật khẩu mới
    static async resetPassword(req, res) {
        const response = await AuthUserService.resetPassword(req.body);
        res.json(response);
    }

    // Đổi mật khẩu
    static async changePassword(req, res) {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới."
            });
        }

        // Gọi service để thực hiện đổi mật khẩu
        const response = await AuthUserService.changePassword(req.user._id, currentPassword, newPassword);

        res.status(200).json(response);
    }

}

module.exports = AuthUserController;
