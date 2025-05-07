'use strict';

const productModel = require('../models/product.model');
const ProductService = require('../services/product.service');
const redis = require('../config/redisClient');
const { default: mongoose } = require('mongoose');
class ProductController {
    // Tạo sản phẩm mới với số lượng tồn kho
    static async createProduct(req, res) {
        const newProduct = await ProductService.createProduct(req.body);
        res.status(201).json({ success: true, data: newProduct, message: 'Thêm sản phẩm thành công' });
    }
    static async trackCategoryView(req, res) {
        const { categoryId } = req.body;
        // Validate categoryId
        if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category ID',
            });
        }

        // Increment category score in Redis sorted set
        const key = `user:${req.user._id}:categories`;

        // Tăng điểm danh mục
        const result = await redis.zincrby(key, 1, categoryId);
        // Đặt thời gian hết hạn 7 ngày (chỉ khi key mới được tạo hoặc chưa có TTL)
        const ttl = await redis.ttl(key);
        if (ttl === -1) {
            await redis.expire(key, 7 * 24 * 60 * 60); // 7 ngày
        }
        if (!result) {
            console.error('Failed to increment category score in Redis:', { categoryId });
            return res.status(500).json({
                success: false,
                message: 'Failed to track category view',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Category view tracked successfully',
        });
    }

    static async recommendByTopCategories(req, res) {
        // Get top 3 categories from Redis sorted set
        const topCategories = await redis.zrevrange(`user:${req.user._id}:categories`, 0, 2, 'WITHSCORES');
        // If no categories found, return empty recommendations
        if (!topCategories || topCategories.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
            });
        }
        // Extract and validate category IDs (skip scores)
        const categoryIds = topCategories
            .filter((_, index) => index % 2 === 0) // Skip scores due to WITHSCORES
            .filter((id) => {
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    console.warn(`Invalid category ID filtered out: ${id}`);
                    return false;
                }
                return true;
            })
            .map((id) => new mongoose.Types.ObjectId(id));
        // If no valid category IDs after filtering
        if (categoryIds.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
            });
        }
        // Find products matching the categories
        const recommendedProducts = await productModel
            .find({
                product_category_id: { $in: categoryIds },
            })
            .select('product_thumb product_price product_name product_discounted_price product_discount product_code product_sold')
            .sort({ product_sold: -1 }) // Sắp xếp giảm dần theo số lượt bán
            .limit(20)
            .lean();

        if (!recommendedProducts) {
            console.error('Failed to fetch recommended products:', { categoryIds });
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch recommendations',
            });
        }

        return res.status(200).json({
            success: true,
            data: recommendedProducts,
        });
    }

    // Lấy sản phẩm theo ID
    static async getProductById(req, res) {
        const product = await ProductService.getProductById(req.params.id);
        res.status(200).json({ success: true, data: product });
    }

    // Cập nhật sản phẩm
    static async updateProduct(req, res) {
        const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);
        res.status(200).json({ success: true, data: updatedProduct, message: 'cập nhật sản phẩm thành công' });
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

    static async getTopViewedProduct(req, res) {
        const data = await productModel.find().sort('-product_views').select('product_thumb product_slug _id').limit(10).lean();
        return res.status(200).json({
            success: true,
            data,
        });
    }
}

module.exports = ProductController;
