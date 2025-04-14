'use strict';

const BrandService = require('../services/brand.service');

class BrandController {
    // Thêm thương hiệu mới
    static async createBrand(req, res, next) {
        const brand = await BrandService.createBrand(req.body);
        res.status(201).json({
            success: true,
            data: brand,
            message: 'Thêm thương hiệu mới thành công!',
        });
    }

    // Lấy danh sách tất cả thương hiệu
    static async getAllBrands(req, res, next) {
        const brands = await BrandService.getAllBrands(req.query);
        res.status(200).json({
            success: true,
            data: brands,
            message: 'Lấy danh sách thương hiệu thành công!',
        });
    }

    // Lấy chi tiết thương hiệu theo ID
    static async getBrandById(req, res, next) {
        const brand = await BrandService.getBrandById(req.params.id);
        res.status(200).json({
            success: true,
            data: brand,
            message: 'Lấy thông tin thương hiệu thành công!',
        });
    }

    // Cập nhật thương hiệu theo ID
    static async updateBrand(req, res, next) {
        const updatedBrand = await BrandService.updateBrand(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: updatedBrand,
            message: 'Cập nhật thương hiệu thành công!',
        });
    }

    // Xóa thương hiệu theo ID
    static async deleteBrand(req, res, next) {
        await BrandService.deleteBrand(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Xóa thương hiệu thành công!',
        });
    }

    // Tìm kiếm thương hiệu theo tên
    static async searchBrand(req, res, next) {
        const brands = await BrandService.searchBrandByName(req.query.name);
        res.status(200).json({
            success: true,
            data: brands,
            message: 'Tìm kiếm thương hiệu theo tên thành công!',
        });
    }

    // Lấy tất cả thương hiệu trong danh mục
    static async getBrandsInCategory(req, res, next) {
        const brands = await BrandService.getBrandsInCategory(req.params.cid);
        res.status(200).json({
            success: true,
            data: brands,
            message: 'Lấy danh sách thương hiệu theo danh mục thành công!',
        });
    }
}

module.exports = BrandController;
