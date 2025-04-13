'use strict';
const { NotFoundError } = require('../core/error.response');
const Product = require('../models/product.model');
const cosineSimilarity = require('../utils/search-image/cosineSimilarity');
const downloadImage = require('../utils/search-image/downloadImage');
const extractFeatures = require('../utils/search-image/extractFeatures');
const path = require('path');
const tf = require('@tensorflow/tfjs'); // Sử dụng phiên bản Web
const generateRandomCode = require('../utils/generateRandomCode');
const productModel = require('../models/product.model');
const fs = require('fs').promises;

class ProductService {
    // Tạo sản phẩm mới với số lượng tồn kho
    static async createProduct(payload) {
        if (Object.keys(payload).length === 0) {
            throw new Error('Vui lòng cung cấp dữ liệu sản phẩm');
        }
        payload.product_code = generateRandomCode(10);
        // Tạo sản phẩm mới
        const newProduct = await Product.create(payload);
        return newProduct;
    }
    // Lấy sản phẩm theo ID
    static async getProductById(productId) {
        const product = await Product.findById(productId).populate(['product_category_id', 'product_brand_id']).lean();
        if (!product) throw new NotFoundError('Không tìm thấy sản phẩm');
        return product;
    }
    static async ScanProduct(product_code) {
        const product = await Product.findOne({ product_code }).select('product_thumb product_price product_name product_discount product_code').lean();
        if (!product) throw new NotFoundError('Không tìm thấy sản phẩm');
        return product;
    }
    // Cập nhật sản phẩm (bao gồm cập nhật số lượng tồn kho nếu có)
    static async updateProduct(productId, updateData) {
        const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
        if (!updatedProduct) throw new NotFoundError('Không tìm thấy sản phẩm để cập nhật');
        return updatedProduct;
    }
    // Xóa sản phẩm
    static async deleteProduct(productId) {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) throw new NotFoundError('Không tìm thấy sản phẩm để xóa');
        return deletedProduct;
    }
    // Tìm kiếm sản phẩm theo
    static async searchProductsByUser({ keySearch, limit, page }) {
        const regexSearch = new RegExp(keySearch);
        const limitNum = parseInt(limit, 10); // Mặc định limit = 10
        const pageNum = parseInt(page, 10); // Mặc định page = 0
        const skipNum = pageNum * limitNum;
        const products = await Product.find({ $text: { $search: regexSearch } }, { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .select('_id product_thumb product_name product_slug product_ratings product_sold product_price product_discount product_quantity')
            .skip(skipNum)
            .limit(limitNum)
            .lean();
        const totalProducts = await Product.countDocuments({ $text: { $search: regexSearch } });
        return {
            totalPage: Math.ceil(totalProducts / limitNum) - 1 || 0, // Tổng số trang (0-based)
            currentPage: pageNum || 0,
            totalProducts,
            products,
        };
    }
    // Lấy tất cả sản phẩm (với các filter)
    static async getAllProductsByAdmin({ limit, page }) {
        const limitNum = parseInt(limit, 10) || 10;
        const pageNum = parseInt(page, 10) || 0;
        const skipNum = pageNum * limitNum;
        const products = await Product.find({ product_isPublished: true }).select('-updatedAt -createdAt -__v').skip(skipNum).limit(limitNum).lean();
        const totalProducts = await Product.countDocuments({ product_isPublished: true });
        return {
            totalPage: Math.ceil(totalProducts / limitNum) - 1,
            currentPage: pageNum,
            totalProducts,
            products,
        };
    }
    // Lấy tất cả sản phẩm (với các filter)
    static async getAllProducts(query = {}) {
        const { limit, page, ...searchConditions } = query;
        const limitNum = parseInt(limit, 10) || 10;
        const pageNum = parseInt(page, 10) || 0;
        const skipNum = pageNum * limitNum;
        const searchFilter = JSON.parse(JSON.stringify(searchConditions).replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`));
        const products = await Product.find(searchFilter, { product_isPublished: true })
            .select('_id product_thumb product_name product_slug product_ratings product_sold product_price product_discount product_quantity')
            .skip(skipNum)
            .limit(limitNum)
            .lean();
        const totalProducts = await Product.countDocuments(searchFilter, { product_isPublished: true });
        return {
            totalPage: Math.ceil(totalProducts / limitNum) - 1,
            currentPage: pageNum,
            totalProducts,
            products,
        };
    }
    // Các chức năng khác (giảm giá, sản phẩm nổi bật, sản phẩm mới, v.v.)
    static async getFeaturedProducts(limit = 30) {
        return await Product.find({ product_isPublished: true })
            .sort({ product_sold: -1, product_ratings: -1 })
            .select('_id product_thumb product_name product_price product_slug product_discount product_sold product_ratings')
            .limit(limit)
            .lean();
    }

    static async getFlashSaleProducts() {
        return await Product.find({
            product_discount: { $gte: 40 },
            product_isPublished: true,
        })
            .select('_id product_thumb product_sold  product_quantity product_name product_slug product_discount')
            .sort({ product_discount: -1 })
            .lean();
    }
    static async getNewProducts() {
        return await productModel
            .find({
                createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
                product_isPublished: true,
            })
            .select('_id product_thumb product_name product_slug product_ratings product_sold product_price product_discount')
            .sort({ createdAt: -1 })
            .lean();
    }
    static async getSimilarProducts(id) {
        const currentProduct = await Product.findById(id);
        if (!currentProduct) throw new NotFoundError('Sản phẩm không tồn tại');
        return await Product.find({
            _id: { $ne: id },
            product_category_id: currentProduct.product_category_id,
            product_isPublished: true,
        })
            .select('_id product_thumb product_name product_slug product_ratings product_sold product_price product_discount')
            .sort({ sold_count: -1 })
            .limit(10)
            .lean();
    }
    static async getProductSuggestions(keySearch) {
        const regexSearch = new RegExp(keySearch);
        // full test search
        const products = await Product.find(
            { $text: { $search: regexSearch }, product_isPublished: true },
            { score: { $meta: 'textScore' } },
            { product_isPublished: true },
        )
            // tài liệu phù hợp nhất sẽ xuất hiện ở đầu kết
            .sort({ score: { $meta: 'textScore' } })
            .select('_id product_name product_slug')
            .limit(8)
            .lean();
        return { products };
    }

    static async searchProductByImage(imageUrl) {
        if (!imageUrl) throw new NotFoundError('Vui lòng cung cấp URL ảnh!');
        const tempPath = path.join(__dirname, 'temp_search.png');
        // Tải ảnh từ URL về thư mục tạm
        if (!(await downloadImage(imageUrl, tempPath))) {
            throw new BadRequestError('Không thể tải ảnh!');
        }
        // Trích xuất đặc trưng từ ảnh tìm kiếm
        const searchFeatures = await extractFeatures(tempPath);
        if (!searchFeatures || searchFeatures.length === 0) {
            throw new BadRequestError('Không thể trích xuất đặc trưng từ ảnh!');
        }
        // Lấy tất cả sản phẩm trong cơ sở dữ liệu (sử dụng `.lean()` để tối ưu hóa hiệu suất)
        const productFeatures = await Product.find({ product_isPublished: true }).lean();
        const results = await Promise.all(
            productFeatures.map(async (product) => {
                // Kiểm tra nếu sản phẩm không có đặc trưng hình ảnh
                if (!product.product_image_features || product.product_image_features.length === 0) {
                    console.warn(`Skipping product ${product.product_thumb} due to empty features`);
                    return { url: product.product_thumb, similarity: 0, product };
                }
                // Tính toán sự tương đồng cosine giữa ảnh tìm kiếm và sản phẩm
                const productTensor = tf.tensor1d(product.product_image_features);
                const similarity = cosineSimilarity(searchFeatures, productTensor);
                return {
                    url: product.product_thumb, // Đường dẫn ảnh sản phẩm
                    similarity: similarity, // Độ tương đồng cosine
                    product: product, // Trả về thông tin sản phẩm
                };
            }),
        );
        // Sắp xếp kết quả theo độ tương đồng giảm dần và lấy 10 sản phẩm tương tự nhất
        const sortedResults = results.sort((a, b) => b.similarity - a.similarity).slice(0, 10);
        // Xóa tệp ảnh tạm sau khi xử lý
        await fs.unlink(tempPath).catch(() => {});
        // Trả về kết quả tìm kiếm với thông tin sản phẩm
        return sortedResults;
    }
    static async getProductsByExpiryStatus({ limit, page, status }) {
        const limitNum = parseInt(limit, 10) || 10; // Giới hạn sản phẩm mỗi trang
        const pageNum = parseInt(page, 10) || 0; // Trang hiện tại
        const skipNum = pageNum * limitNum; // Tính toán số lượng bỏ qua

        let filter = {};
        const currentDate = new Date(); // Lưu lại ngày hiện tại

        // Lọc sản phẩm theo trạng thái hết hạn
        switch (status) {
            case 'expired': // Hết hạn
                filter = {
                    product_expiry_date: { $lt: currentDate }, // Ngày hết hạn đã qua
                };
                break;
            case 'near_expiry': // Cận hạn (dưới 1 tháng nữa)
                const nearExpiryDate = new Date(currentDate);
                nearExpiryDate.setMonth(currentDate.getMonth() + 1); // Cập nhật một tháng tới
                filter = {
                    product_expiry_date: { $gte: currentDate, $lt: nearExpiryDate }, // Còn dưới 1 tháng
                };
                break;
            case 'valid': // Còn hạn (hơn 1 tháng nữa)
                const validDate = new Date(currentDate);
                validDate.setMonth(currentDate.getMonth() + 1); // Cập nhật một tháng tới
                filter = {
                    product_expiry_date: { $gte: validDate }, // Hơn 1 tháng nữa
                };
                break;
            default:
                throw new BadRequestError('Trạng thái hạn sử dụng không hợp lệ.');
        }

        // Lấy sản phẩm theo trạng thái
        const products = await Product.find(filter).skip(skipNum).limit(limitNum).lean();

        const totalProducts = await Product.countDocuments(filter);

        return {
            totalPage: Math.ceil(totalProducts / limitNum) - 1, // Số trang tổng cộng
            currentPage: pageNum, // Trang hiện tại
            totalProducts, // Tổng số sản phẩm
            products, // Danh sách sản phẩm
        };
    }
}

module.exports = ProductService;
