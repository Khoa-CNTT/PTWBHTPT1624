const slugify = require('slugify');

const autoCode = (title) => {
    const slug = slugify(title, '').toUpperCase(); // Chuyển thành chuỗi viết hoa không dấu
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Bộ ký tự gồm chữ và số
    let code = '';

    // Lấy 5 ký tự đầu từ slug (nếu có)
    for (let i = 0; i < 5; i++) {
        if (i < slug.length) {
            code += slug[i];
        } else {
            code += characters[Math.floor(Math.random() * characters.length)];
        }
    }

    // Thêm 5 ký tự ngẫu nhiên
    for (let i = 0; i < 5; i++) {
        code += characters[Math.floor(Math.random() * characters.length)];
    }

    return code;
};

module.exports = autoCode;
