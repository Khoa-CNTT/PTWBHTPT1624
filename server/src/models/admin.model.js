const mongoose = require('mongoose');

const adminSchema = mongoose.Schema(
    {
        admin_name: { type: String, default: '' },
        admin_email: { type: String, required: true, unique: true },
        admin_type: { type: String, enum: ['admin', 'employee'], default: 'employee' },
        admin_roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }], // Một admin có thể có nhiều role
        admin_password: { type: String },
        admin_mobile: { type: String, unique: true },
        admin_avatar_url: { type: String },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Admin', adminSchema);
