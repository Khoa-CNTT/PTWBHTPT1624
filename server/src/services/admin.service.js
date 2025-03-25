"use strict";

const { BadRequestError } = require("../core/error.response");
const bcrypt = require("bcrypt");
const AdminModel = require("../models/admin.model");

class AdminService {
    static async addAdmin(payload) {
        const { admin_name, admin_email, admin_password, admin_mobile,admin_type  } = payload;
        if (!(admin_name ||  admin_email ||  admin_password ||  admin_mobile|| admin_type ) ) {
            throw new BadRequestError("Thiếu thông tin bắt buộc!", 400);
        }
        const existingAdmin = await AdminModel.findOne({ admin_email });
        if (existingAdmin) throw new BadRequestError("Email đã tồn tại!", 400);
        const existingMobile = await AdminModel.findOne({ admin_mobile });
        if (existingMobile) throw new BadRequestError("Số điện thoại đã tồn tại!", 400);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(admin_password, salt);
        const newAdmin = new AdminModel({
            ...payload,
            admin_password: hashedPassword,
        });

        return await newAdmin.save();
    }

    static async updateAdmin(uid, payload) { 
        const { admin_email, admin_password, admin_mobile, ...dataAdmin } = payload;
        const admin = await AdminModel.findById(uid);
        if (!admin) throw new BadRequestError("Người dùng không tồn tại!", 404);
        if (admin_mobile && admin_mobile !== admin.admin_mobile) {
            const existingMobile = await AdminModel.findOne({ admin_mobile });
            if (existingMobile) throw new BadRequestError("Số điện thoại đã tồn tại!", 400);
            dataAdmin.admin_mobile = admin_mobile;
        }
        if (admin_password) {
            const salt = await bcrypt.genSalt(10);
            dataAdmin.admin_password = await bcrypt.hash(admin_password, salt);
        } 
        return await AdminModel.findByIdAndUpdate(uid, dataAdmin, {
            new: true,
            runValidators: true
        });
 
    }

    static async deleteAdmin(uid) {
        const admin = await AdminModel.findByIdAndDelete(uid);
        if (!admin) throw new BadRequestError("Người dùng không tồn tại!", 404);

        return {
            _id: admin._id,
            admin_name: admin.admin_name,
            admin_email: admin.admin_email
        };
    }

    static async toggleBlockAdmin(uid, isBlocked) {
        if (typeof isBlocked !== "boolean") {
            if (isBlocked === "true") isBlocked = true;
            else if (isBlocked === "false") isBlocked = false;
            else throw new BadRequestError("Trạng thái chặn không hợp lệ!", 400);
        }
        const admin = await AdminModel.findById(uid);
        if (!admin) throw new BadRequestError("Người dùng không tồn tại!", 404);
        admin.admin_isBlocked = isBlocked;
        await admin.save();
        return isBlocked ? "Đã chặn người dùng thành công!" : "Đã mở chặn người dùng!";
    }
    

    static async getAllAdmins() {
        return await AdminModel.find({}, "-admin_password");
    }

    static async getProfile(adminid) {
        return await AdminModel.findById(adminid).select("-admin_password");
    }
    static async updateProfile(uid, payload) {
        const { admin_password, ...updateData } = payload; // Không cho phép cập nhật mật khẩu
    
        // Tìm admin theo ID
        const admin = await AdminModel.findById(uid); // ✅ Sửa lại `AdminModel`
        if (!admin) {
            throw new BadRequestError("Người dùng không tồn tại!", 404);
        }
    
        // Kiểm tra số điện thoại đã tồn tại (nếu có cập nhật số điện thoại)
        if (updateData.admin_mobile && updateData.admin_mobile !== admin.admin_mobile) {
            const existingMobile = await AdminModel.findOne({ admin_mobile: updateData.admin_mobile }); // ✅ Sửa lại `AdminModel`
            if (existingMobile) {
                throw new BadRequestError("Số điện thoại đã tồn tại!", 400);
            }
        }
    
        // Cập nhật thông tin
        const updatedAdmin = await AdminModel.findByIdAndUpdate(uid, updateData, { // ✅ Sửa lại `AdminModel`
            new: true,
            runValidators: true
        });
    
        return updatedAdmin;
    }
    
}

module.exports = AdminService;
