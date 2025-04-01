"use strict";
const mongoose = require("mongoose");
const slugify = require("slugify");
const autoCode=require("../utils/autoCode")
const categorySchema = mongoose.Schema(
    {
        category_name: { type: String, required: true, unique: true }, // Tên danh mục
        category_thumb: { type: String, required: true }, // Hình ảnh của danh mục
        category_code: { type: String, required: true,    default: function () {
            return autoCode (this.category_name, { lower: true });
        }, }, // Hình ảnh của danh mục
        category_slug: {
            type: String,
            required: true,
            unique: true,
            default: function () {
                return slugify(this.category_name, { lower: true });
            },
        }, // Slug của danh mục
    },
    {
        timestamps: true,
    }
);
categorySchema.pre("save", async function (next) {
    // Kiểm tra nếu category_name đã tồn tại trong cơ sở dữ liệu
    const existingProduct = await mongoose.model("Category").findOne({ category_name: this.category_name });
    if (existingProduct && existingProduct._id.toString() !== this._id.toString()) {
        const error = new Error("Tên danh mục đã tồn tại");
        error.status =203; // Gán mã lỗi vào đối tượng lỗi
      return next(error);
    }
    next();
});

module.exports = mongoose.model("Category", categorySchema);
