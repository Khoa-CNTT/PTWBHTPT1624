'use strict';

const { BadRequestError } = require('../core/error.response');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');

class UserService {
    static async addUser(payload) {
        const { user_name, user_email, user_password, user_mobile } = payload;
        if (!user_name || !user_email || !user_password || !user_mobile) {
            throw new BadRequestError('Thiếu thông tin bắt buộc!', 400);
        }
        const existingUser = await UserModel.findOne({ user_email });
        if (existingUser) throw new BadRequestError('Email đã tồn tại!', 400);
        const existingMobile = await UserModel.findOne({ user_mobile });
        if (existingMobile) throw new BadRequestError('Số điện thoại đã tồn tại!', 400);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user_password, salt);
        const newUser = new UserModel({
            ...payload,
            user_password: hashedPassword,
        });

        return await newUser.save();
    }

    static async updateUser(uid, payload) {
        const { user_email, user_password, user_mobile, ...dataUser } = payload;

        const user = await UserModel.findById(uid);
        if (!user) throw new BadRequestError('Người dùng không tồn tại!', 404);

        if (user_mobile && user_mobile !== user.user_mobile) {
            const existingMobile = await UserModel.findOne({ user_mobile });
            if (existingMobile) throw new BadRequestError('Số điện thoại đã tồn tại!', 400);
            dataUser.user_mobile = user_mobile;
        }

        if (user_password) {
            const salt = await bcrypt.genSalt(10);
            dataUser.user_password = await bcrypt.hash(user_password, salt);
        }
        return await UserModel.findByIdAndUpdate(uid, dataUser, {
            new: true,
            runValidators: true,
        });
    }

    static async deleteUser(uid) {
        const user = await UserModel.findByIdAndDelete(uid);
        if (!user) throw new BadRequestError('Người dùng không tồn tại!', 404);

        return {
            _id: user._id,
            user_name: user.user_name,
            user_email: user.user_email,
        };
    }

    static async toggleBlockUser(uid, isBlocked) {
        if (typeof isBlocked !== 'boolean') {
            if (isBlocked === 'true') isBlocked = true;
            else if (isBlocked === 'false') isBlocked = false;
            else throw new BadRequestError('Trạng thái chặn không hợp lệ!', 400);
        }

        const user = await UserModel.findById(uid);
        if (!user) throw new BadRequestError('Người dùng không tồn tại!', 404);

        user.user_isBlocked = isBlocked;
        await user.save();
        return isBlocked ? 'Đã chặn người dùng thành công!' : 'Đã mở chặn người dùng!';
    }

    static async getAllUsers({ limit, page }) {
        const limitNum = parseInt(limit, 10); // Mặc định limit = 10
        const pageNum = parseInt(page, 10); // Mặc định page = 0
        const skipNum = pageNum * limitNum;
        const users = await UserModel.find()
            .sort({ createdAt: -1 })
            .select('user_name user_email user_isBlocked user_address user_mobile user_avatar_url')
            .skip(skipNum)
            .limit(limitNum)
            .lean();
        const totalUser = await UserModel.countDocuments();
        return {
            totalPage: Math.ceil(totalUser / limitNum) - 1 || 0, // Tổng số trang (0-based)
            currentPage: pageNum || 0,
            totalUser,
            users,
        };
    }

    static async getProfile(userid) {
        return await UserModel.findById(userid).select('-user_password');
    }
    static async updateProfile(uid, payload) {
        const { user_password, ...updateData } = payload; // Không cho phép cập nhật mật khẩu

        // Tìm user theo ID
        const user = await UserModel.findById(uid); // ✅ Sửa lại `UserModel`
        if (!user) {
            throw new BadRequestError('Người dùng không tồn tại!', 404);
        }

        // Kiểm tra số điện thoại đã tồn tại (nếu có cập nhật số điện thoại)
        if (updateData.user_mobile && updateData.user_mobile !== user.user_mobile) {
            const existingMobile = await UserModel.findOne({ user_mobile: updateData.user_mobile }); // ✅ Sửa lại `UserModel`
            if (existingMobile) {
                throw new BadRequestError('Số điện thoại đã tồn tại!', 400);
            }
        }

        // Cập nhật thông tin
        const updatedUser = await UserModel.findByIdAndUpdate(uid, updateData, {
            // ✅ Sửa lại `UserModel`
            new: true,
            runValidators: true,
        });

        return updatedUser;
    }
    static async searchUsers(query) {
        const { name } = query;  // Lấy từ query parameter
        if (!name) {
            throw new BadRequestError('Vui lòng cung cấp từ khóa tìm kiếm!', 400);
        }
    
        const users = await UserModel.find({
            $or: [
                { user_name: { $regex: name, $options: 'i' } },  // Tìm theo tên người dùng
                { user_email: { $regex: name, $options: 'i' } },  // Tìm theo email
            ]
        })
        .select('user_name user_email user_isBlocked user_mobile user_avatar_url')
        .lean();
    
        return users;
    }
}

module.exports = UserService;
