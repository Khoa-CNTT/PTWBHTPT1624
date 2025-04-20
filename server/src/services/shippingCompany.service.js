'use strict';

const { RequestError, NotFoundError } = require('../core/error.response');
const ShippingCompany = require('../models/shippingCompany.model');

class ShippingCompanyService {
    // Tạo công ty vận chuyển mới
    static async createShippingCompany(payload) {
        if (!payload.sc_name || !payload.sc_phone || !payload.sc_shipping_price) {
            throw new RequestError('Thiếu thông tin bắt buộc!');
        }
        return await ShippingCompany.create(payload);
    }
    // Lấy danh sách tất cả công ty vận chuyển
    static async getAllShippingCompanies({ limit, page }) {
        if (!(limit && page)) {
            return await ShippingCompany.find({ sc_active: true });
        }
        const skipNum = page * limit;
        const ShippingCompanies = await ShippingCompany.find().select('-__v -createdAt -updatedAt').sort({ createdAt: -1 }).skip(skipNum).limit(limit).lean();
        const totalShippingCompany = await ShippingCompany.countDocuments();
        return {
            totalPage: Math.ceil(totalShippingCompany / limit) - 1 || 0, // Tổng số trang (0-based)
            currentPage: page || 0,
            totalShippingCompany,
            ShippingCompanies,
        };
    }

    // Lấy công ty vận chuyển theo ID
    static async getShippingCompanyById(id) {
        const shippingCompany = await ShippingCompany.findById(id);
        if (!shippingCompany) throw new NotFoundError('Công ty vận chuyển không tồn tại!');
        return shippingCompany;
    }

    // Cập nhật công ty vận chuyển theo ID
    static async updateShippingCompany(id, payload) {
        const updatedShippingCompany = await ShippingCompany.findByIdAndUpdate(id, payload, { new: true });
        if (!updatedShippingCompany) throw new NotFoundError('Công ty vận chuyển không tồn tại!');
        return updatedShippingCompany;
    }

    // Xóa công ty vận chuyển theo ID
    static async deleteShippingCompany(id) {
        const shippingCompany = await ShippingCompany.findByIdAndDelete(id);
        if (!shippingCompany) throw new NotFoundError('Công ty vận chuyển không tồn tại!');
        return shippingCompany;
    }

    // 🔹 Tìm kiếm công ty vận chuyển theo tên
    static async searchShippingCompaniesByName(name) {
        if (!name) throw new RequestError('Vui lòng nhập tên công ty để tìm kiếm');

        const companies = await ShippingCompany.find({
            sc_name: { $regex: name, $options: 'i' }, // Tìm kiếm không phân biệt hoa thường
        });

        if (companies.length === 0) throw new NotFoundError('Không tìm thấy công ty nào');

        return companies;
    }
}

module.exports = ShippingCompanyService;
