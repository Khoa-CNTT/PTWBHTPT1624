"use strict";

const { BadRequestError } = require("../core/error.response");
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const redis = require("../config/redisClient");
const { randomTokenByCrypto, hashTokenByCrypto } = require("../utils/tokenUtils");
const sendMail = require("../utils/sendMail");
const adminModel = require("../models/admin.model");
const createTokenPairs = require("../utils/auth/createTokenPairs");
const verifyRefreshToken = require("../utils/auth/verifyRefreshToken");

class AuthAdminService {
    static async adminLogin({ email, password }, res) {
        const foundAdmin = await adminModel.find({admin_email:email})
        if (!foundAdmin) {
            throw new BadRequestError("Tài khoản không tồn tại", 403)
        }
        const matchPassword = bcrypt.compareSync(password, foundAdmin.admin_password)
        if (!matchPassword) throw new BadRequestError("Tài khoản hoặc mật khẩu không đúng", 201)
        const tokens = await createTokenPairs(foundAdmin)
        const { accessToken, refreshToken } = tokens
        res.cookie("ad_rf", `${refreshToken}`, {
            httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return accessToken
    }
    static async adminLogout(res) {
        res.clearCookie("ad_rf")
    }
    static async handleRefreshToken(refreshToken, res) {
        if (!refreshToken) throw new BadRequestError("Cookie required", 201)
        const response = verifyRefreshToken(refreshToken)
        if (!response) throw new BadRequestError("Verification failed", 201)
        const foundAdmin = await adminModel.findById(response._id)
        const tokens = await createTokenPairs(foundAdmin)
        res.cookie("ad_rf", `${tokens.refreshToken}`, {
            httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return tokens.accessToken
    }
 

}

module.exports = AuthAdminService;