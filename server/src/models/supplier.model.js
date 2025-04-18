const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify'); // Chỉ khai báo một lần

const supplierSchema = new Schema(
    {
        supplier_name: { type: String, required: true },
        supplier_address: { type: String },
        supplier_email: { type: String, required: true, unique: true },
        supplier_phone: {
            type: String,
            required: true,
            validate: {
                validator: function (value) {
                    return /^\d{10,11}$/.test(value);
                },
                message: 'Số điện thoại phải có từ 10 đến 11 chữ số',
            },
            unique: true, // Đảm bảo số điện thoại là duy nhất
        },
        supplier_description: { type: String },
    },
    { timestamps: true },
);

supplierSchema.pre('save', async function (next) {
    // Kiểm tra tên nhà cung cấp có trùng không
    const existingSupplier = await mongoose.model('Supplier').findOne({ supplier_name: this.supplier_name });
    if (existingSupplier && existingSupplier._id.toString() !== this._id.toString()) {
        const error = new Error('Tên nhà cung cấp đã tồn tại!');
        error.status = 201;
        return next(error);
    }

    // Kiểm tra email có trùng không (cả khi tạo và khi cập nhật)
    const existingEmail = await mongoose.model('Supplier').findOne({ supplier_email: this.supplier_email });
    if (existingEmail && existingEmail._id.toString() !== this._id.toString()) {
        const error = new Error('Email nhà cung cấp đã tồn tại!');
        error.status = 201;
        return next(error);
    }

    // Kiểm tra số điện thoại có trùng không (cả khi tạo và khi cập nhật)
    const existingPhone = await mongoose.model('Supplier').findOne({ supplier_phone: this.supplier_phone });
    if (existingPhone && existingPhone._id.toString() !== this._id.toString()) {
        const error = new Error('Số điện thoại nhà cung cấp đã tồn tại!');
        error.status = 201;
        return next(error);
    }

    next();
});

// Kiểm tra khi update
supplierSchema.pre('findOneAndUpdate', async function (next) {
    const updatedSupplier = this._update;

    // Kiểm tra email khi update
    if (updatedSupplier.supplier_email) {
        const existingEmail = await mongoose.model('Supplier').findOne({ supplier_email: updatedSupplier.supplier_email });
        if (existingEmail && existingEmail._id.toString() !== updatedSupplier._id.toString()) {
            const error = new Error('Email nhà cung cấp đã tồn tại!');
            error.status = 201;
            return next(error);
        }
    }

    // Kiểm tra số điện thoại khi update
    if (updatedSupplier.supplier_phone) {
        const existingPhone = await mongoose.model('Supplier').findOne({ supplier_phone: updatedSupplier.supplier_phone });
        if (existingPhone && existingPhone._id.toString() !== updatedSupplier._id.toString()) {
            const error = new Error('Số điện thoại nhà cung cấp đã tồn tại!');
            error.status = 201;
            return next(error);
        }
    }

    next();
});

module.exports = mongoose.model('Supplier', supplierSchema);
