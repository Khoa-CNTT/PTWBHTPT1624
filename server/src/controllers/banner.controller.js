'use strict';

const BannerService = require('../services/banner.service');

class BannerController {
    // Thêm banner mới
    static async createBanner(req, res, next) {
        const newBanner = await BannerService.createBanner(req.body);
        res.status(201).json({
            success: true,
            data: newBanner,
            message: 'Thêm banner mới thành công!',
        });
    }

    // Lấy tất cả banner (có phân trang)
    static async getAllBanners(req, res, next) {
        const { limit, page } = req.query;
        const banners = await BannerService.getAllBanners({ limit: Number(limit), page: Number(page) });
        res.status(200).json({
            success: true,
            data: banners,
            message: 'Lấy danh sách banner thành công!',
        });
    }

    // Lấy chi tiết banner theo ID
    static async getBannerById(req, res, next) {
        const banner = await BannerService.getBannerById(req.params.id);
        res.status(200).json({
            success: true,
            data: banner,
            message: 'Lấy thông tin banner thành công!',
        });
    }

    // Cập nhật banner
    static async updateBanner(req, res, next) {
        const updatedBanner = await BannerService.updateBanner(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: updatedBanner,
            message: 'Cập nhật banner thành công!',
        });
    }

    // Xóa banner
    static async deleteBanner(req, res, next) {
        const deletedBanner = await BannerService.deleteBanner(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Xóa banner thành công!',
            data: deletedBanner,
        });
    }

    // Tìm kiếm banner theo tên
    static async searchBanner(req, res, next) {
        const banners = await BannerService.searchBannerByName(req.query.name);
        res.status(200).json({
            success: true,
            data: banners,
            message: 'Tìm kiếm banner theo tên thành công!',
        });
    }
}

module.exports = BannerController;
