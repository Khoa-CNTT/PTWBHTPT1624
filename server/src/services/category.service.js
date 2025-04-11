'use strict';

const { BadRequestError, NotFoundError } = require('../core/error.response');
const Category = require('../models/category.model');
const productModel = require('../models/product.model');

class CategoryService {
    // Tạo danh mục mới
    static async createCategory(payload) {
        if (!payload.category_name || !payload.category_thumb) {
            throw new BadRequestError('Vui lòng cung cấp đầy đủ dữ liệu');
        }
        // Dùng new Category() thay vì Category.create()
        const category = new Category(payload);
        const savedCategory = await category.save();
        return savedCategory;
    }

    // Lấy tất cả danh mục
    static async getAllCategories({ limit, page }) {
        if (!(limit && page)) {
            return await Category.find().select('-__v').sort({ createdAt: -1 }).lean();
        }
        const limitNum = parseInt(limit, 10); // Mặc định limit = 10
        const pageNum = parseInt(page, 10); // Mặc định page = 0
        const skipNum = pageNum * limitNum;
        const categories = await Category.find().sort({ createdAt: -1 }).skip(skipNum).limit(limitNum).lean();
        const totalCategory = await Category.countDocuments();
        return {
            totalPage: Math.ceil(totalCategory / limitNum) - 1 || 0, // Tổng số trang (0-based)
            currentPage: pageNum || 0,
            totalCategory,
            categories,
        };
    }

    // Lấy danh mục theo ID
    static async getCategoryById(categoryId) {
        const category = await Category.findById(categoryId);
        if (!category) throw new NotFoundError('Không tìm thấy danh mục');
        return category;
    }

    // Cập nhật danh mục
    static async updateCategory(categoryId, updateData) {
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, updateData, { new: true, runValidators: true });
        if (!updatedCategory) throw new NotFoundError('Không tìm thấy danh mục');
        return updatedCategory;
    }

    // Xóa danh mục
    static async deleteCategory(categoryId) {
        const deletedCategory = await Category.findById(categoryId);
        if (!deletedCategory) {
            throw new NotFoundError('Không tìm thấy danh mục');
        }
        // Kiểm tra xem danh mục có sản phẩm hay không
        const totalProducts = await productModel.countDocuments({ product_category_id: categoryId }).exec();
        if (totalProducts > 0) {
            throw new BadRequestError(`Danh mục hiện có ${totalProducts} sản phẩm`);
        }
        // Xóa danh mục
        await deletedCategory.deleteOne();
    }

    // Tìm kiếm danh mục theo tên
    static async searchCategoryByName(name) {
        const categories = await Category.find({
            category_name: { $regex: name, $options: 'i' },
        });
        return categories;
    }
}

module.exports = CategoryService;
