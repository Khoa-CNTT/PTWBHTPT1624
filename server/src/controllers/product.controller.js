'use strict';

const ProductService = require('../services/product.service');

class ProductController {
    // Tạo sản phẩm mới với số lượng tồn kho
    static async createProduct(req, res) {
        const newProduct = await ProductService.createProduct(req.body);
        res.status(201).json({ success: true, data: newProduct, message: 'Thêm sản phẩm thành công' });
    }

    // Lấy sản phẩm theo ID
    static async getProductById(req, res) {
        const product = await ProductService.getProductById(req.params.id);
        res.status(200).json({ success: true, data: product });
    }

    // Cập nhật sản phẩm
    static async updateProduct(req, res) {
        const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);
        res.status(200).json({ success: true, data: updatedProduct });
    }
    static async getListSearchProduct(req, res) {
        const { keySearch } = req.params;
        res.status(200).json({
            success: true,
            data: await ProductService.searchProductsByUser({ keySearch, ...req.query }),
        });
    }

    // Xóa sản phẩm
    static async deleteProduct(req, res) {
        const deletedProduct = await ProductService.deleteProduct(req.params.id);
        res.status(200).json({ success: true, message: 'Sản phẩm đã được xóa', data: deletedProduct });
    }
    // Lấy tất cả sản phẩm
    static async getAllProductsByAdmin(req, res) {
        const products = await ProductService.getAllProductsByAdmin(req.query);
        res.status(200).json({ success: true, data: products });
    }
    // Lấy tất cả sản phẩm
    static async getAllProducts(req, res) {
        const products = await ProductService.getAllProducts(req.query);
        res.status(200).json({ success: true, data: products });
    }

    // Các chức năng khác (featured, flash sale, sản phẩm mới, v.v.)
    static async getFeaturedProducts(req, res) {
        const { limit } = req.query;
        const products = await ProductService.getFeaturedProducts(limit);

        res.status(200).json({ success: true, data: products });
    }

    static async getFlashSaleProducts(req, res) {
        const products = await ProductService.getFlashSaleProducts();
        res.status(200).json({ success: true, data: products });
    }

    static async getNewProducts(req, res) {
        const products = await ProductService.getNewProducts();
        res.status(200).json({ success: true, data: products });
    }

    static async getSimilarProducts(req, res) {
        const products = await ProductService.getSimilarProducts(req.params.id);
        res.status(200).json({ success: true, data: products });
    }

    // gợi ý sản phẩm khi search
    static async searchProductByImage(req, res) {
        const { imageUrl } = req.body;
        res.status(200).json({
            success: true,
            data: await ProductService.searchProductByImage(imageUrl),
        });
    }
    static async ScanProduct(req, res) {
        const { product_code } = req.query;
        res.status(200).json({
            success: true,
            data: await ProductService.ScanProduct(product_code),
            message: 'Quét sản phẩm thành công',
        });
    }
    static async getProductSuggestions(req, res) {
        const { keySearch } = req.params;
        res.status(200).json({
            success: true,
            data: await ProductService.getProductSuggestions(keySearch),
            message: 'Quét sản phẩm thành công',
        });
    }

    // Lấy sản phẩm theo trạng thái hạn sử dụng
    static async getProductsByExpiryStatus(req, res, next) {
        const { status } = req.params; // Lấy trạng thái từ tham số URL
        const { limit = 10, page = 0 } = req.query; // Lấy limit và page từ query parameters

        // Kiểm tra tham số `status`
        if (!['expired', 'near_expiry', 'valid'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Trạng thái hạn sử dụng không hợp lệ. Chỉ có thể là expired, near_expiry, hoặc valid.',
            });
        }

        // Kiểm tra giá trị của `limit` và `page`
        if (isNaN(limit) || limit <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Giá trị limit không hợp lệ. Vui lòng cung cấp một số dương.',
            });
        }

        if (isNaN(page) || page < 0) {
            return res.status(400).json({
                success: false,
                message: 'Giá trị page không hợp lệ. Vui lòng cung cấp một số không âm.',
            });
        }

        const data = await ProductService.getProductsByExpiryStatus({ status, limit, page });

        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách sản phẩm theo hạn sử dụng thành công.',
            data,
        });
    }
}

module.exports = ProductController;
