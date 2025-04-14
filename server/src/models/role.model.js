const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema(
    {
        role_name: { type: String, unique: true, required: true },
        role_permissions: { type: [String], default: [], required: true }, // Mảng quyền
    },
    {
        timestamps: true,
    },
);

// Kiểm tra trùng tên role trước khi lưu mới
RoleSchema.pre('save', async function (next) {
    const existingRole = await mongoose.model('Role').findOne({ role_name: this.role_name });

    if (existingRole && existingRole._id.toString() !== this._id.toString()) {
        const error = new Error('Tên vai trò đã tồn tại');
        error.status = 203; // Gán mã lỗi vào đối tượng lỗi
        return next(error);
    }

    next();
});

// Kiểm tra trùng tên role khi cập nhật
RoleSchema.pre('findOneAndUpdate', async function (next) {
    const updatedRole = this._update;
    if (updatedRole.role_name) {
        const existingRole = await mongoose.model('Role').findOne({ role_name: updatedRole.role_name });
        if (existingRole && existingRole._id.toString() !== updatedRole._id.toString()) {
            const error = new Error('Tên vai trò đã tồn tại');
            error.status = 203; // Gán mã lỗi vào đối tượng lỗi
            return next(error);
        }
    }

    next();
});

module.exports = mongoose.model('Role', RoleSchema);
