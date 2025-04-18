const mongoose = require('mongoose');
const slugify = require('slugify');

const brandSchema = mongoose.Schema(
    {
        brand_name: { type: String, required: true, unique: true },
        brand_slug: {
            type: String,
            required: true,
            default: function () {
                return slugify(this.brand_name, { lower: true });
            },
        },
        brand_banner: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);

// Kiểm tra trùng lặp trước khi lưu (tạo mới)
brandSchema.pre('save', async function (next) {
    this.brand_slug = slugify(this.brand_name);

    // Kiểm tra trùng lặp brand_name
    const existingBrand = await mongoose.model('Brand').findOne({ brand_name: this.brand_name });

    if (existingBrand && existingBrand._id.toString() !== this._id.toString()) {
        const error = new Error('Tên thương hiệu đã tồn tại!');
        error.status = 201;
        return next(error);
    }

    next();
});

// Kiểm tra trùng lặp khi cập nhật
brandSchema.pre('findOneAndUpdate', async function (next) {
    const updatedBrand = this._update;

    // Gán lại brand_slug nếu brand_name thay đổi
    if (updatedBrand.brand_name) {
        // Gán slug mới từ brand_name
        updatedBrand.brand_slug = slugify(updatedBrand.brand_name, { lower: true });

        // Kiểm tra trùng lặp brand_name
        const existingBrand = await mongoose.model('Brand').findOne({ brand_name: updatedBrand.brand_name });

        if (existingBrand && existingBrand._id.toString() !== updatedBrand._id.toString()) {
            const error = new Error('Tên thương hiệu đã tồn tại!');
            error.status = 201;
            return next(error);
        }
    }

    next();
});

module.exports = mongoose.model('Brand', brandSchema);
