const { BadRequestError } = require('../core/error.response');
const Supplier = require('../models/supplier.model');

class SupplierService {
    // Thêm nhà cung cấp
    static async createSupplier({ supplier_name, supplier_email, supplier_phone, supplier_address }) {
        if (!supplier_name || !supplier_email || !supplier_phone) {
            throw new BadRequestError('Thông tin không hợp lệ.');
        }

        const newSupplier = await Supplier.create({
            supplier_name,
            supplier_email,
            supplier_phone,
            supplier_address,
        });

        return newSupplier;
    }

    // Lấy tất cả nhà cung cấp
    static async getAllSuppliers({ limit, page }) {
        const limitNum = parseInt(limit, 10); // Mặc định limit = 10
        const pageNum = parseInt(page, 10); // Mặc định page = 0
        const skipNum = pageNum * limitNum;
        const suppliers = await Supplier.find().sort({ createdAt: -1 }).skip(skipNum).limit(limitNum).lean();
        const totalSupplier = await Supplier.countDocuments();
        return {
            totalPage: Math.ceil(totalSupplier / limitNum) - 1 || 0, // Tổng số trang (0-based)
            currentPage: pageNum || 0,
            totalSupplier,
            suppliers,
        };
    }

    // Lấy thông tin nhà cung cấp theo ID
    static async getSupplierById(supplierId) {
        const supplier = await Supplier.findById(supplierId);
        if (!supplier) throw new Error('Nhà cung cấp không tồn tại.');
        return supplier;
    }

    // Cập nhật nhà cung cấp
    static async updateSupplier(supplierId, updateData) {
        const supplier = await Supplier.findByIdAndUpdate(supplierId, updateData, {
            new: true,
            runValidators: true,
        });
        if (!supplier) throw new Error('Nhà cung cấp không tồn tại.');
        return supplier;
    }

    // Xóa nhà cung cấp
    static async deleteSupplier(supplierId) {
        const supplier = await Supplier.findByIdAndDelete(supplierId);
        if (!supplier) throw new Error('Nhà cung cấp không tồn tại.');
        return { message: 'Nhà cung cấp đã được xóa thành công.' };
    }
}

module.exports = SupplierService;
