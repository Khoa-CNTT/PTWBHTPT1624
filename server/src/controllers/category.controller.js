'use strict';

const CategoryService = require('../services/category.service');

class CategoryController {
    // Tạo danh mục mới
    static async createCategory(req, res, next) {
        const category = await CategoryService.createCategory(req.body);
        res.status(201).json({
            success: true,
            data: category,
            message: 'Tạo danh mục mới thành công!',
        });
    }

    // Lấy tất cả danh mục
    static async getAllCategories(req, res, next) {
        const categories = await CategoryService.getAllCategories(req.query);
        res.status(200).json({
            success: true,
            data: categories,
            message: 'Lấy danh sách danh mục thành công!',
        });
    }

    // Lấy danh mục theo ID
    static async getCategoryById(req, res, next) {
        const category = await CategoryService.getCategoryById(req.params.id);
        res.status(200).json({
            success: true,
            data: category,
            message: 'Lấy thông tin danh mục thành công!',
        });
    }

    // Cập nhật danh mục theo ID
    static async updateCategory(req, res, next) {
        const updatedCategory = await CategoryService.updateCategory(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: updatedCategory,
            message: 'Cập nhật danh mục thành công!',
        });
    }

    // Xóa danh mục
    static async deleteCategory(req, res, next) {
        await CategoryService.deleteCategory(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Xóa danh mục thành công!',
        });
    }

    // Tìm danh mục theo tên
    static async searchCategory(req, res, next) {
        const categories = await CategoryService.searchCategoryByName(req.query.name);
        res.status(200).json({
            success: true,
            data: categories,
            message: 'Tìm kiếm danh mục theo tên thành công!',
        });
    }
}

module.exports = CategoryController;
