'use strict';

const { RequestError, NotFoundError } = require('../core/error.response');
const ShippingCompany = require('../models/shippingCompany.model');

class ShippingCompanyService {
    // Tạo công ty vận chuyển mới
    static async createShippingCompany(payload) {
        const { sc_name, sc_phone, sc_email, sc_shipping_price } = payload;
    
        if (!sc_name || !sc_phone || sc_shipping_price === undefined) {
            throw new RequestError('Thiếu thông tin bắt buộc!');
        }
    
        // Kiểm tra trùng tên
        const existingName = await ShippingCompany.findOne({ sc_name });
        if (existingName) {
            throw new RequestError('Tên công ty đã tồn tại!');
        }
    
        // Kiểm tra trùng số điện thoại
        const existingPhone = await ShippingCompany.findOne({ sc_phone });
        if (existingPhone) {
            throw new RequestError('Số điện thoại đã được sử dụng!');
        }
    
        // Kiểm tra trùng email (nếu có nhập)
        if (sc_email) {
            const existingEmail = await ShippingCompany.findOne({ sc_email });
            if (existingEmail) {
                throw new RequestError('Email đã được sử dụng!');
            }
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
    // Cập nhật công ty vận chuyển theo ID
static async updateShippingCompany(id, payload) {
    const { sc_name, sc_phone, sc_email } = payload;

    // Kiểm tra trùng tên
    const existingName = await ShippingCompany.findOne({ sc_name });
    if (existingName && existingName._id !== id) { // Tránh trường hợp tìm trùng chính công ty đang cập nhật
        throw new RequestError('Tên công ty đã tồn tại!');
    }

    // Kiểm tra trùng số điện thoại
    const existingPhone = await ShippingCompany.findOne({ sc_phone });
    if (existingPhone && existingPhone._id !== id) { // Tránh trường hợp tìm trùng chính công ty đang cập nhật
        throw new RequestError('Số điện thoại đã được sử dụng!');
    }

    // Kiểm tra trùng email (nếu có nhập)
    if (sc_email) {
        const existingEmail = await ShippingCompany.findOne({ sc_email });
        if (existingEmail && existingEmail._id !== id) { // Tránh trường hợp tìm trùng chính công ty đang cập nhật
            throw new RequestError('Email đã được sử dụng!');
        }
    }

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
