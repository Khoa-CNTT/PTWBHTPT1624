const SupplierService = require('../services/supplier.service');

class SupplierController {
    // Thêm nhà cung cấp
    static async createSupplier(req, res, next) {
        try {
            const supplier = await SupplierService.createSupplier(req.body);
            res.status(201).json({
                success: true,
                data: supplier,
                message: 'Thêm nhà cung cấp mới thành công!',
            });
        } catch (error) {
            next(error);
        }
    }

    // Lấy tất cả nhà cung cấp
    static async getAllSuppliers(req, res, next) {
        try {
            const suppliers = await SupplierService.getAllSuppliers(req.query);
            res.status(200).json({
                success: true,
                data: suppliers,
                message: 'Lấy danh sách nhà cung cấp thành công!',
            });
        } catch (error) {
            next(error);
        }
    }

    // Lấy thông tin nhà cung cấp theo ID
    static async getSupplierById(req, res, next) {
        try {
            const { id } = req.params;
            const supplier = await SupplierService.getSupplierById(id);
            res.status(200).json({
                success: true,
                data: supplier,
                message: 'Lấy thông tin nhà cung cấp thành công!',
            });
        } catch (error) {
            next(error);
        }
    }

    // Cập nhật thông tin nhà cung cấp
    static async updateSupplier(req, res, next) {
        try {
            const { id } = req.params;
            const supplier = await SupplierService.updateSupplier(id, req.body);
            res.status(200).json({
                success: true,
                data: supplier,
                message: 'Cập nhật thông tin nhà cung cấp thành công!',
            });
        } catch (error) {
            next(error);
        }
    }

    // Xóa nhà cung cấp
    static async deleteSupplier(req, res, next) {
        try {
            const { id } = req.params;
            const response = await SupplierService.deleteSupplier(id);
            res.status(200).json({
                success: true,
                message: 'Xóa nhà cung cấp thành công!',
            });
        } catch (error) {
            next(error);
        }
    }

    // Tìm kiếm nhà cung cấp theo tên
    static async searchSupplier(req, res, next) {
        try {
            const { name } = req.query;
            if (!name) {
                return res.status(400).json({
                    success: false,
                    message: 'Tên nhà cung cấp không được để trống.',
                });
            }
            const suppliers = await SupplierService.searchSupplierByName(name);
            res.status(200).json({
                success: true,
                data: suppliers,
                message: 'Tìm kiếm nhà cung cấp thành công!',
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = SupplierController;
