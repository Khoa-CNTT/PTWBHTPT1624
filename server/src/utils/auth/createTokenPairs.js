const JWT = require('jsonwebtoken');
require('dotenv').config();

const createTokenPairs = async (payload) => {
    try {
        const accessToken = JWT.sign(payload, process.env.ACCESS_SECRET, { expiresIn: 60 * 60 * 24 * 30 }); // 15 phút
        const refreshToken = JWT.sign(payload, process.env.REFRESH_SECRET, { expiresIn: 60 * 60 * 24 * 60 }); // 7 ngày
        return { accessToken, refreshToken };
    } catch (error) {
        return error.message;
    }
};

module.exports = createTokenPairs;
