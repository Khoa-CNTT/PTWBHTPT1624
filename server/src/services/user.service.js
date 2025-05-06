'use strict';
const mongoose = require('mongoose');

const { RequestError } = require('../core/error.response');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const OrderModel = require('../models/OnlineOrder');
const ReviewModel = require('../models/reviews.model');
const Voucher = require('../models/voucher.model');
const UserVoucherModel = require('../models/userVoucher.model');

class UserService {
    static async addUser(payload) {
        const { user_name, user_email, user_password, user_mobile } = payload;
        if (!user_name || !user_email || !user_password || !user_mobile) {
            throw new RequestError('Thiếu thông tin bắt buộc!', 400);
        }
        const existingUser = await UserModel.findOne({ user_email });
        if (existingUser) throw new RequestError('Email đã tồn tại!', 400);
        const existingMobile = await UserModel.findOne({ user_mobile });
        if (existingMobile) throw new RequestError('Số điện thoại đã tồn tại!', 400);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user_password, salt);
        const newUser = new UserModel({
            ...payload,
            user_password: hashedPassword,
        });

        return await newUser.save();
    }

    static async deleteUser(uid) {
        // Kiểm tra uid có phải ObjectId hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(uid)) {
            throw new RequestError('ID người dùng không hợp lệ.');
        }

        // Kiểm tra xem người dùng đã từng đánh giá chưa
        const hasReviews = await ReviewModel.exists({ user: new mongoose.Types.ObjectId(uid) });

        if (hasReviews) {
            throw new RequestError('Không thể xóa tài khoản vì người dùng đã từng đánh giá sản phẩm.');
        }

        // Tiến hành xóa
        const deletedUser = await UserModel.findByIdAndDelete(uid);
        if (!deletedUser) {
            throw new RequestError('Người dùng không tồn tại.');
        }

        return {
            message: 'Xóa người dùng thành công.',
        };
    }
    static async toggleBlockUser(uid, isBlocked) {
        const user = await UserModel.findById(uid);
        if (!user) throw new RequestError('Người dùng không tồn tại!', 404);
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
            totalPage: Math.ceil(totalUser / limitNum) || 0, // Tổng số trang (0-based)
            currentPage: pageNum || 0,
            totalUser,
            users,
        };
    }

    static async getProfile(userid) {
        return await UserModel.findById(userid).select('_id user_name user_reward_points user_email user_isBlocked user_address user_mobile user_avatar_url');
    }
    static async updateProfile(uid, payload) {
        const { _id, ...updateData } = payload; // Loại bỏ _id khỏi dữ liệu cập nhật

        // Tìm user theo ID
        const user = await UserModel.findById(uid);
        if (!user) {
            throw new RequestError('Người dùng không tồn tại!', 404);
        }

        // Kiểm tra số điện thoại đã tồn tại (nếu có cập nhật số điện thoại)
        if (updateData.user_mobile && updateData.user_mobile !== user.user_mobile) {
            const existingMobile = await UserModel.findOne({ user_mobile: updateData.user_mobile });
            if (existingMobile) {
                throw new RequestError('Số điện thoại đã tồn tại!', 409); // Mã lỗi 409 phù hợp hơn cho xung đột
            }
        }

        // Cập nhật thông tin
        const updatedUser = await UserModel.findByIdAndUpdate(uid, updateData, {
            new: true, // Trả về tài liệu đã cập nhật
            runValidators: true, // Chạy các validator của schema
        });

        return updatedUser;
    }
    static async searchUsers(query) {
        const { name } = query; // Lấy từ query parameter
        if (!name) {
            throw new RequestError('Vui lòng cung cấp từ khóa tìm kiếm!', 400);
        }

        const users = await UserModel.find({
            $or: [
                { user_name: { $regex: name, $options: 'i' } }, // Tìm theo tên người dùng
                { user_email: { $regex: name, $options: 'i' } }, // Tìm theo email
                { user_mobile: { $regex: name, $options: 'i' } },
            ],
        })
            .select('user_name user_email user_isBlocked user_mobile user_avatar_url')
            .lean();

        return users;
    }
    static async updateUserByAdmin(userId, updateData) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new RequestError('Người dùng không tồn tại');
        }

        // Kiểm tra trùng email với user khác
        if (updateData.user_email) {
            const existingEmailUser = await UserModel.findOne({
                user_email: updateData.user_email,
                _id: { $ne: userId }, // khác chính user đang update
            });
            if (existingEmailUser) {
                throw new RequestError('Email đã được sử dụng bởi người dùng khác');
            }
        }

        // Kiểm tra trùng số điện thoại với user khác
        if (updateData.user_mobile) {
            const existingMobileUser = await UserModel.findOne({
                user_mobile: updateData.user_mobile,
                _id: { $ne: userId },
            });
            if (existingMobileUser) {
                throw new RequestError('Số điện thoại đã được sử dụng bởi người dùng khác');
            }
        }

        // Nếu có mật khẩu mới thì hash lại
        if (updateData.user_password) {
            if (updateData.user_password.length < 6) {
                throw new RequestError('Mật khẩu phải có ít nhất 6 ký tự');
            }
            updateData.user_password = await bcrypt.hash(updateData.user_password, 10);
        }

        // Cập nhật thông tin còn lại
        for (let key in updateData) {
            user[key] = updateData[key];
        }

        await user.save();

        return {
            message: 'Cập nhật người dùng thành công',
            user: {
                _id: user._id,
                user_name: user.user_name,
                user_email: user.user_email,
                user_mobile: user.user_mobile,
                user_role: user.user_role,
                user_isBlocked: user.user_isBlocked,
            },
        };
    }

    static async changePassword(uid, oldPassword, newPassword) {
        // Kiểm tra độ dài mật khẩu mới
        if (newPassword.length < 6) {
            throw new RequestError('Mật khẩu mới phải có ít nhất 6 ký tự', 400);
        }

        // Tìm người dùng theo ID
        const user = await UserModel.findById(uid);
        if (!user) {
            throw new RequestError('Người dùng không tồn tại!', 404);
        }

        // Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.user_password);
        if (!isMatch) {
            throw new RequestError('Mật khẩu cũ không đúng!', 400);
        }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Cập nhật mật khẩu mới và thời gian thay đổi
        user.user_password = hashedPassword;
        user.user_passwordChangedAt = new Date();

        // Lưu thông tin cập nhật
        await user.save();

        return {
            success: true,
            message: 'Đổi mật khẩu thành công!',
        };
    }
    static async playLuckyBox(userId, prizeIndex) {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new RequestError('Người dùng không tồn tại!', 404);
        }
        switch (prizeIndex) {
            case 0:
                user.user_reward_points = (user.user_reward_points || 0) + 10000; // Cộng điểm vào tài khoản
                await user.save();
                return {
                    type: 'point',
                    user_total_point: user.user_reward_points, // Trả về tổng điểm sau khi cộng thêm
                };
            case 2:
                console.log('Trúng phiếu giảm giá');
                break;
            case 3:
                user.user_reward_points = (user.user_reward_points || 0) + 10000; // Cộng điểm vào tài khoản
                await user.save();
                return {
                    type: 'point',
                    user_total_point: user.user_reward_points, // Trả về tổng điểm sau khi cộng thêm
                };
                break;
            case 5:
                console.log('Trúng 50.000 xu');
                break;
            case 7:
                console.log('Trúng 2 lượt quay');
                break;
            default:
                console.log('Không trúng thưởng');
                break;
        }
        // const rewards = [1000, 2000, 5000]; // Điểm cho mỗi hộp
        // const randomIndex = Math.floor(Math.random() * rewards.length); // Chọn ngẫu nhiên hộp
        // const rewardPoints = rewards[randomIndex]; // Điểm nhận được từ hộp
        // // Cập nhật điểm người dùng
        // const user = await UserModel.findById(userId);
        // if (!user) {
        //     throw new RequestError('Người dùng không tồn tại!', 404);
        // }
        // user.user_reward_points = (user.user_reward_points || 0) + rewardPoints; // Cộng điểm vào tài khoản
        // await user.save();
        // return {
        //     rewardPoints,
        //     totalPoints: user.user_reward_points, // Trả về tổng điểm sau khi cộng thêm
        // };
    }

    // Lấy 3 voucher mới nhất
    static async getLatestVouchers() {
        return Voucher.find({
            voucher_type: 'user',
            voucher_is_active: true,
            voucher_end_date: { $gte: new Date() },
        })
            .sort({ createdAt: -1 })
            .limit(3);
    }

    // Lấy một voucher ngẫu nhiên còn hiệu lực
    static async getRandomVoucher() {
        const vouchers = await Voucher.find({
            voucher_type: 'user',
            voucher_is_active: true,
            voucher_end_date: { $gte: new Date() },
        });

        if (!vouchers.length) return null;

        const randomIndex = Math.floor(Math.random() * vouchers.length);
        return vouchers[randomIndex];
    }

    // Chơi game Lucky Box
    static async vongquay(userId) {
        const rewardChance = Math.random(); // Xác suất trúng
        const pointsList = [1000, 2000, 5000, 10000];

        let reward;

        if (rewardChance <= 0.5) {
            // 50% trúng điểm
            const point = pointsList[Math.floor(Math.random() * pointsList.length)];
            reward = { type: 'points', value: point };
        } else if (rewardChance <= 0.7) {
            // 20% trúng voucher
            const [latestVouchers, randomVoucher] = await Promise.all([this.getLatestVouchers(), this.getRandomVoucher()]);

            const voucherMap = new Map();
            latestVouchers.forEach((v) => voucherMap.set(v._id.toString(), v));
            if (randomVoucher) voucherMap.set(randomVoucher._id.toString(), randomVoucher);

            const allVouchers = Array.from(voucherMap.values());

            if (allVouchers.length === 0) {
                throw new RequestError('Không có voucher hợp lệ!', 404);
            }

            const selectedVoucher = allVouchers[Math.floor(Math.random() * allVouchers.length)];

            // Kiểm tra người dùng đã có chưa
            const existed = await UserVoucherModel.findOne({
                vc_user_id: userId,
                vc_vouchers: selectedVoucher._id,
            });

            if (existed) {
                reward = {
                    type: 'points',
                    message: 'Bạn đã có voucher này, giá trị đã được thay đổi thành 10,000 điểm.',
                    value: 10000,
                };
            } else {
                await UserVoucherModel.findOneAndUpdate({ vc_user_id: userId }, { $addToSet: { vc_vouchers: selectedVoucher._id } }, { upsert: true });
                reward = { type: 'voucher', voucher: selectedVoucher };
            }
        } else {
            // 30% trượt
            reward = { type: 'lucky', message: 'Chúc may mắn lần sau!' };
        }

        // Nếu có điểm thì cộng vào user
        if (reward.type === 'points') {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new RequestError('Người dùng không tồn tại!', 404);
            }
            user.user_reward_points += reward.value;
            await user.save();
        }

        return reward;
    }

    static async getWheelRewards() {
        const points = [1000, 2000, 5000].map((value) => ({
            type: 'points',
            value,
            label: `${value} điểm`,
        }));

        const vouchers = await Voucher.find({
            voucher_type: 'user',
            voucher_is_active: true,
            voucher_end_date: { $gte: new Date() },
        }).limit(5); // Lấy tối đa 2 voucher

        const voucherRewards = vouchers.map((voucher) => ({
            type: 'voucher',
            voucher_name: voucher.voucher_name,
            label: voucher.voucher_name,
        }));

        const luckyReward = {
            type: 'lucky',
            message: 'Chúc may mắn lần sau',
            label: 'Chúc may mắn',
        };

        return [...points, ...voucherRewards, luckyReward];
    }
}

module.exports = UserService;
