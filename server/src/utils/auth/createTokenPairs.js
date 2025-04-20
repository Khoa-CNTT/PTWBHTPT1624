const jwt = require('jsonwebtoken');
require('dotenv').config();

const createTokenPairs = async (payload) => {
    try {
        const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET, { expiresIn: '30d' }); // 30 ngày
        const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: '60d' }); // 60 ngày
        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Error creating token pairs:', error.message);
        throw new Error(error.message); // Ném lỗi thay vì trả về chuỗi
    }
};

module.exports = createTokenPairs;
