'use strict';

const productModel = require('../models/product.model');
const categoryModel = require('../models/category.model');
const brandModel = require('../models/brand.model');
const shippingCompanyModel = require('../models/shippingCompany.model');
const userModel = require('../models/user.model');
const textConverter = require('../utils/textConverter');
const redisClient = require('../config/redisClient'); // Sử dụng redisClient từ file cấu hình
const OnlineOrder = require('../models/OnlineOrder');

class ChatbotPromptController {
    static async getPrompt(req, res) {
        const { userId } = req.query;
        console.log({ userId });
        const { page = 1, limit = 50 } = req.query;
        const skip = (page - 1) * limit;
        // Hàm lấy dữ liệu từ cache
        const getCachedData = async (key, fetchFunction) => {
            try {
                const cached = await redisClient.get(key);
                if (cached) return JSON.parse(cached);
                const data = await fetchFunction();
                await redisClient.setex(key, 3600, JSON.stringify(data)); // Cache 1 giờ
                return data;
            } catch (err) {
                console.error(`Redis Cache Error (${key}):`, err);
                return fetchFunction(); // Fallback nếu Redis lỗi
            }
        };
        // Truy vấn song song
        const [orders, stats, totalCustomers, products, categories, brands, shippings] = await Promise.all([
            userId
                ? OnlineOrder.find({ order_user: userId })
                      .select('sc_name order_products order_shipping_address order_shipping_price order_date_shipping order_shipping_company order_status')
                      .populate({
                          path: 'order_products.productId',
                          select: 'product_name product_thumb product_slug _id',
                      })
                      .lean()
                : [],
            productModel.aggregate([
                {
                    $group: {
                        _id: null,
                        totalSold: { $sum: '$product_sold' },
                        totalVisits: { $sum: '$product_views' },
                        totalProducts: { $sum: 1 },
                    },
                },
            ]),
            userModel.countDocuments({ user_isBlocked: false }),
            productModel
                .find({ product_isPublished: true })
                .select('product_name product_sold product_ratings product_discount product_thumb product_description product_slug _id')
                .skip(skip)
                .limit(limit)
                .lean(),
            getCachedData('categories', () => categoryModel.find().select('category_name category_thumb category_slug category_code').lean()),
            getCachedData('brands', () => brandModel.find().select('brand_name brand_thumb brand_slug _id').lean()),
            getCachedData('shippings', () => shippingCompanyModel.find().select('sc_name sc_address sc_shipping_price sc_shipping_time').lean()),
        ]);

        // Tạo thống kê
        const statsText = `
        Tổng số lượng sản phẩm đã bán: ${stats[0]?.totalSold || 0},
        Tổng số lượng khách hàng không bị khóa: ${totalCustomers || 0},
        Tổng số sản phẩm: ${stats[0]?.totalProducts || 0},
        Tổng số lượt xem sản phẩm: ${stats[0]?.totalVisits || 0}
    `;
        // Chuyển đổi dữ liệu thành văn bản
        const productTextData = textConverter.convertProductsToText(products);
        const categoryTextData = textConverter.convertCategoryToText(categories);
        const brandTextData = textConverter.convertBrandToText(brands);
        const shippingTextData = textConverter.convertShippingToText(shippings);
        const orderTextData = orders.length ? textConverter.convertOrderToText(orders) : '';
        // Tạo context cho trợ lý bán hàng
        const context = `
            Bạn là một trợ lý bán hàng trực tuyến siêu dễ thương 💕 cho một website thương mại điện tử chuyên cung cấp các sản phẩm *thực phẩm* tươi ngon như rau củ 🥬, trái cây 🍎, thịt cá 🥩 và nhiều món hấp dẫn khác. Nhiệm vụ của bạn là hỗ trợ khách hàng bằng cách trả lời các câu hỏi một cách:
            👉 Ngắn gọn  
            👉 Chính xác  
            👉 Dễ thương, hài hước  
            👉 Gần gũi và thân thiện 🥰  
            🎨 <strong>Yêu cầu định dạng câu trả lời:</strong>  
            - Mỗi câu trả lời phải được trình bày bằng <strong>HTML</strong>, sử dụng các thẻ như <code><div></code>, <code><p></code>, <code><ul></code>, <code><strong></code>, <code><img></code>, v.v.  
            - Hãy style nhẹ nhàng cho màu sắc, kích thước chữ nếu cần, giúp hiển thị đẹp mắt và rõ ràng.
            - Ưu tiên chia đoạn hoặc danh sách để dễ đọc và dễ theo dõi.
            - KHÔNG bao giờ chèn phần trả lời trong \`\`\`html hoặc bất kỳ code block nào. Chỉ trả về HTML trực tiếp thôi nhen! ✨
            📦 <strong>Trường hợp khách hỏi về sản phẩm, danh mục, thương hiệu, công ty vận chuyển, thống kê, đơn hàng cụ thể:</strong>  
            - Bạn có quyền truy cập vào dữ liệu sản phẩm từ: <code>${productTextData}</code>  
            - Bạn có quyền truy cập vào dữ liệu danh mục sản phẩm từ: <code>${categoryTextData}</code>  
            - Bạn có quyền truy cập vào dữ liệu thương hiệu sản phẩm từ: <code>${brandTextData}</code>  
            - Bạn có quyền truy cập vào dữ liệu công ty vận chuyển từ: <code>${shippingTextData}</code>  
            - Bạn có quyền truy cập vào dữ liệu thống kê về website từ: <code>${statsText}</code>  
            ${orderTextData ? `Bạn có quyền truy cập vào dữ liệu đơn hàng của người dùng: <code>${orderTextData}</code>` : ''}
            - Nếu khách hỏi như: "còn hàng không?", "giá bao nhiêu?", "xuất xứ ở đâu?" thì hãy tìm trong dữ liệu và trả lời đúng kèm HTML trình bày đẹp.  
            - Nếu liên quan đến hình ảnh, hãy hiển thị bằng thẻ <code><img src="..." /></code> với URL từ sản phẩm tương ứng nhé 📸.
            - Thêm liên kết cho từng sản phẩm dựa trên URL sản phẩm.
            📌 <strong>Nếu không có thông tin cụ thể:</strong>  
            - Trả lời một cách hợp lý và dễ thương, mang tính vui vẻ, động viên khách, giúp họ cảm thấy được quan tâm 💖.
            🧠 <strong>Ghi nhớ quan trọng:</strong>  
            - Luôn giữ phong cách nhẹ nhàng, hỗ trợ nhiệt tình và tạo cảm giác thân thiện.  
            - Ưu tiên sự rõ ràng, mạch lạc trong câu trả lời, nhưng vẫn giữ chất "cute" và dễ gần của bạn nhé! 😘
        `;

        return res.status(200).json({ success: true, context });
    }
}

module.exports = ChatbotPromptController;
