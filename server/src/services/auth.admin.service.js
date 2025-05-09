'use strict';

const { RequestError } = require('../core/error.response');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const redis = require('../config/redisClient');
const { randomTokenByCrypto, hashTokenByCrypto } = require('../utils/tokenUtils');
const sendMail = require('../utils/sendMail');
const createTokenPairs = require('../utils/auth/createTokenPairs');
const verifyRefreshToken = require('../utils/auth/verifyRefreshToken');
const adminModel = require('../models/admin.model');

class AuthAdminService {
    static async adminLogin({ email, password }, res) {
        const foundAdmin = await adminModel.findOne({ admin_email: email }).lean();
        if (!foundAdmin) {
            throw new RequestError('Tài khoản không tồn tại', 203);
        }
        const matchPassword = bcrypt.compareSync(password, foundAdmin.admin_password);
        if (!matchPassword) throw new RequestError('Tài khoản hoặc mật khẩu không đúng', 201);
        const tokens = await createTokenPairs(foundAdmin);
        const { accessToken, refreshToken } = tokens;
        res.cookie('ad_rf', `${refreshToken}`, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return accessToken;
    }
    static async adminLogout(res) {
        res.clearCookie('ad_rf');
    }
    static async handleRefreshToken(refreshToken, res) {
        if (!refreshToken) throw new RequestError('Cookie required', 201);
        const response = verifyRefreshToken(refreshToken);
        if (!response) throw new RequestError('Verification failed', 201);
        const foundAdmin = await adminModel.findById(response._id).lean();
        const tokens = await createTokenPairs(foundAdmin);
        res.cookie('ad_rf', `${tokens.refreshToken}`, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return tokens.accessToken;
    }
}

module.exports = AuthAdminService;
