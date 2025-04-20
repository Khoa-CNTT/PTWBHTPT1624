const crypto = require('crypto');
// Tạo chuỗi ngẫu nhiên chỉ gồm số, ví dụ: "582104"
const randomNumberToken = (length) => {
    let token = '';
    for (let i = 0; i < length; i++) {
        const digit = crypto.randomInt(0, 10); // từ 0 đến 9
        token += digit.toString();
    }
    return token;
};

const randomTokenByCrypto = (bytes) => crypto.randomBytes(bytes).toString('hex');
// create a hash of the token using SHA256 algorithm
const hashTokenByCrypto = (token) => crypto.createHash('sha256').update(token).digest('hex');

module.exports = { randomTokenByCrypto, hashTokenByCrypto, randomNumberToken };
