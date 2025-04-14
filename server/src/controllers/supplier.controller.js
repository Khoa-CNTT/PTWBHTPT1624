const SupplierService = require('../services/supplier.service');

class SupplierController {
    // Thêm nhà cung cấp
    static async createSupplier(req, res, next) {
        const supplier = await SupplierService.createSupplier(req.body);
        res.status(201).json({
            success: true,
            data: supplier,
            message: 'Thêm nhà cung cấp mới thành công!',
        });
    }

    // Lấy tất cả nhà cung cấp
    static async getAllSuppliers(req, res, next) {
        const suppliers = await SupplierService.getAllSuppliers(req.query);
        res.status(200).json({
            success: true,
            data: suppliers,
            message: 'Lấy danh sách nhà cung cấp thành công!',
        });
    }

    // Lấy thông tin nhà cung cấp theo ID
    static async getSupplierById(req, res, next) {
        const { id } = req.params;
        const supplier = await SupplierService.getSupplierById(id);
        res.status(200).json({
            success: true,
            data: supplier,
            message: 'Lấy thông tin nhà cung cấp thành công!',
        });
    }

    // Cập nhật thông tin nhà cung cấp
    static async updateSupplier(req, res, next) {
        const { id } = req.params;
        const supplier = await SupplierService.updateSupplier(id, req.body);
        res.status(200).json({
            success: true,
            data: supplier,
            message: 'Cập nhật thông tin nhà cung cấp thành công!',
        });
    }

    // Xóa nhà cung cấp
    static async deleteSupplier(req, res, next) {
        const { id } = req.params;
        const response = await SupplierService.deleteSupplier(id);
        res.status(200).json({
            success: true,
            message: 'Xóa nhà cung cấp thành công!',
        });
    }
}

module.exports = SupplierController;
