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

module.exports = mongoose.model('Role', RoleSchema);
