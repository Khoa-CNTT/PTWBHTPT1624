'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify');

// Định nghĩa schema cho sản phẩm
const productSchema = new Schema(
    {
        product_name: { type: String, required: true },
        product_code: { type: String, required: true, unique: true },
        product_slug: { type: String, unique: true },
        product_views: { type: Number, default: 0 },
        product_thumb: { type: String, required: true }, // Hình ảnh đại diện sản phẩm
        product_images: [{ type: String, required: true }], // Các hình ảnh của sản phẩm
        product_price: { type: Number, required: true, default: 0 },
        product_expiry_date: { type: Date }, // Hạn sử dụng
        product_discount: { type: Number, default: 0 }, // %
        product_discounted_price: { type: Number, default: 0 }, // Giá sau chiết khấu
        product_description: { type: String, required: true },
        product_attribute: { type: Schema.Types.Mixed, required: true }, // Thuộc tính của sản phẩm (size, color, ...)
        product_ratings: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
            set: (val) => Math.round(val * 10) / 10, // Làm tròn đánh giá
        },
        product_sold: { type: Number, default: 0 }, // Số lượng đã bán
        product_category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        product_brand_id: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
        product_supplier_id: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
        product_quantity: { type: Number, required: true, default: 0 }, // Số lượng hàng tồn kho
        product_isPublished: { type: Number, required: true, default: true }, // Trạng thái xuất bản
        product_image_features: { type: Array, required: true }, // Trạng thái xuất bản
    },
    {
        timestamps: true,
    },
);

// Tạo chỉ mục văn bản cho các trường tên và mô tả sản phẩm
productSchema.index({ product_name: 'text', product_description: 'text' });

// Tính toán giá sau chiết khấu
productSchema.pre('save', async function (next) {
    // Kiểm tra xem danh mục có tồn tại không
    const category = await mongoose.model('Category').findById(this.product_category_id);
    if (!category) {
        const error = new Error('Category does not exist');
        return next(error);
    }

    // Kiểm tra xem thương hiệu có tồn tại không
    const brand = await mongoose.model('Brand').findById(this.product_brand_id);
    if (!brand) {
        const error = new Error('Brand does not exist');
        return next(error);
    }

    // Kiểm tra xem nhà cung cấp có tồn tại không
    const supplier = await mongoose.model('Supplier').findById(this.product_supplier_id);
    if (!supplier) {
        const error = new Error('Supplier does not exist');
        return next(error);
    }

    // Kiểm tra nếu product_name đã tồn tại trong cơ sở dữ liệu
    const existingProduct = await mongoose.model('Product').findOne({ product_name: this.product_name });
    if (existingProduct && existingProduct._id.toString() !== this._id.toString()) {
        const error = new Error('Tên sản phẩm đã tồn tại!');
        error.status = 201;
        return next(error);
    }

    // Tạo slug nếu chưa có
    if (!this.product_slug) {
        this.product_slug = slugify(this.product_name, { lower: true });
    }

    // Tính toán giá sau chiết khấu
    this.product_discounted_price = this.product_price * (1 - this.product_discount / 100);

    next();
});

// Middleware kiểm tra trùng lặp product_name và cập nhật giá sau chiết khấu trước khi cập nhật
productSchema.pre('findOneAndUpdate', async function (next) {
    const updatedProduct = this.getUpdate();
    const productName = updatedProduct.product_name;

    // Kiểm tra nếu product_name đã tồn tại trong cơ sở dữ liệu
    if (productName) {
        const existingProduct = await mongoose.model('Product').findOne({ product_name: productName });
        if (existingProduct && existingProduct._id.toString() !== this._conditions._id.toString()) {
            const error = new Error('Tên sản phẩm đã tồn tại!');
            error.status = 201;
            return next(error);
        }
    }

    // Cập nhật giá sau chiết khấu nếu có thay đổi giá hoặc chiết khấu
    if (updatedProduct.product_price || updatedProduct.product_discount) {
        const product = await mongoose.model('Product').findById(this._conditions._id);
        const newPrice = updatedProduct.product_price || product.product_price;
        const newDiscount = updatedProduct.product_discount || product.product_discount;
        updatedProduct.product_discounted_price = newPrice * (1 - newDiscount / 100);
    }

    next();
});

// Export model
module.exports = mongoose.model('Product', productSchema);
