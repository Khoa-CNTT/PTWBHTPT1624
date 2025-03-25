"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const Banner = require("../models/banner.model.js");

class BannerService {
    // Tạo banner mới
    static async createBanner(payload) {
        if (Object.keys(payload).length === 0) {
            throw new BadRequestError("Vui lòng cung cấp dữ liệu banner");
        }
        return await Banner.create(payload);
    }

    // Lấy tất cả banner (hỗ trợ phân trang)
    static async getAllBanners({ limit = 10, page = 1 }) {
           const limitNum = parseInt(limit, 10); // Mặc định limit = 10
            const pageNum = parseInt(page, 10); // Mặc định page = 0
            const skipNum = pageNum * limitNum;
            const banners= await Banner.find().sort({ createdAt: -1 }).skip(skipNum) .limit(limitNum).lean()
            const totalBanner= await Banner.countDocuments();
            return {
              totalPage: Math.ceil(totalBanner/ limitNum) - 1||0, // Tổng số trang (0-based)
              currentPage: pageNum||0,
              totalBanner,
              banners,
            }; 
    }

    // Lấy banner theo ID
    static async getBannerById(bannerId) {
        const banner = await Banner.findById(bannerId);
        if (!banner) throw new NotFoundError("Không tìm thấy banner");
        return banner;
    }

    // Cập nhật banner
    static async updateBanner(bannerId, updateData) {
        const updatedBanner = await Banner.findByIdAndUpdate(bannerId, updateData, { new: true });
        if (!updatedBanner) throw new NotFoundError("Không tìm thấy banner để cập nhật");
        return updatedBanner;
    }

    // Xóa banner
    static async deleteBanner(bannerId) {
        const deletedBanner = await Banner.findByIdAndDelete(bannerId);
        if (!deletedBanner) throw new NotFoundError("Không tìm thấy banner để xóa");
        return deletedBanner;
    }
    //tìm theo tên
    static async searchBannerByName(name) {
        const banners = await Banner.find({ banner_title: { $regex: name, $options: "i" } });
        return banners;
    }

}


module.exports = BannerService;
