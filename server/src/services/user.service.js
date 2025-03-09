"use strict";

const { BadRequestError } = require("../core/error.response");
const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const RoleModel = require("../models/role.model");

class UserService { 

    static async addUser(payload) {
        const { user_name, user_email, user_password, user_mobile, user_type } = payload;
        // Kiểm tra dữ liệu đầu vào
        if (!user_name || !user_email || !user_password || !user_mobile || !user_type) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc!" });
        }
        // Kiểm tra email đã tồn tại chưa
        const existingUser = await User.findOne({ user_email });
        if (existingUser) { throw new BadRequestError("Email đã tồn tại!", 400); }
        // Kiểm tra số điện thoại đã tồn tại chưa
        const existingMobile = await User.findOne({ user_mobile });
        if (existingMobile) { throw new BadRequestError("Số điện thoại đã tồn tại!", 400); }
        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user_password, salt);
        // Tạo user mới
        const newUser = new User({
            user_password: hashedPassword,
            ...payload
        });
        // Lưu user vào database
        return await newUser.save();
    }
    static async updateUser(uid, payload) {
        // Bỏ email và mật khẩu ra khỏi payload để tránh cập nhật
        const { user_email, user_password, user_mobile, user_reward_points, ...dataUser } = payload;
        // Tìm user theo ID
        const user = await userModel.findById(uid);
        if (!user) { 
            throw new BadRequestError("Người dùng không tồn tại!", 404);
        }
        // Kiểm tra số điện thoại đã tồn tại (nếu có cập nhật số điện thoại)
        if (user_mobile && user_mobile !== user.user_mobile) {
            const existingMobile = await userModel.findOne({ user_mobile });
            if (existingMobile) { 
                throw new BadRequestError("Số điện thoại đã tồn tại!", 400);
            }
            dataUser.user_mobile = user_mobile;
        }
        // Mã hóa mật khẩu nếu có cập nhật
        if (user_password) {
            const salt = await bcrypt.genSalt(10);
            dataUser.user_password = await bcrypt.hash(user_password, salt);
        }
    
        // Kiểm tra và cập nhật trường user_reward_points nếu có
        if (user_reward_points !== undefined) {
            dataUser.user_reward_points = user_reward_points;
        }
    
        // Cập nhật dữ liệu người dùng
        const updatedUser = await userModel.findByIdAndUpdate(uid, dataUser, {
            new: true,
            runValidators: true
        });
    
        return updatedUser;
    }

    static async deleteUser(uid) {
        const user = await userModel.findByIdAndDelete(uid);
        if (!user) {
            throw new BadRequestError("Người dùng không tồn tại!", 404);
        }
        return {
            _id: user._id,
            user_name: user.user_name,
            user_email: user.user_email
        };
    }

    static async toggleBlockUser(uid, isBlocked) {
        const user = await userModel.findById(uid);
        if (!user) {
            throw new BadRequestError("Người dùng không tồn tại!", 404);
        }
        user.user_isBlocked = isBlocked;
        await user.save();
        return isBlocked ? "Đã chặn người dùng thành công!" : "Đã mở chặn người dùng!";
    }
    //tất cả tk
    static async getAllUsers() {
        const users = await userModel.find({}, "-user_password"); // Ẩn mật khẩu
        return users;
    }
    
}
module.exports = UserService;
