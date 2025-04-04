'use strict';

const ProductService = require('../services/product.service');

class ProductController {
    // Tạo sản phẩm mới với số lượng tồn kho
    static async createProduct(req, res) {
        const newProduct = await ProductService.createProduct(req.body);
        res.status(201).json({ success: true, data: newProduct });
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
        const products = await ProductService.getFeaturedProducts();
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
        const products = await ProductService.getSimilarProductsByCategory(req.params.id);
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
}

module.exports = ProductController;
