const Product = require("../models/product.model.js");
const User = require("../models/user.model.js");
const Order = require("../models/order.model.js");
const Review = require("../models/reviews.model.js");

class DashboardService {
    static async getStats(startDate, endDate) {
        try {
            const totalProducts = await Product.countDocuments();
            const totalUsers = await User.countDocuments();
            const totalOrders = await Order.countDocuments();
            const totalPendingOrders = await Order.countDocuments({ order_status: "pending" });
            const totalDeliveredOrders = await Order.countDocuments({ order_status: "delivered" });

            const totalReviews = await Review.countDocuments();
            const totalApprovedReviews = await Review.countDocuments({ isApproved: true });
            const totalPendingReviews = await Review.countDocuments({ isApproved: false });

            const pendingReviews = await Review.find({ isApproved: false })
                .select("review_user review_comment review_rating review_productId createdAt")
                .populate("review_user", "user_name user_email")
                .populate("review_productId", "product_name");

            // Lấy tháng hiện tại
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

            // Chỉ lấy tổng doanh thu của tháng hiện tại
            const totalRevenueData = await Order.aggregate([
                {
                    $match: {
                        order_status: "delivered",
                        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$order_total_price" }
                    }
                }
            ]);
            const totalRevenue = totalRevenueData[0]?.total || 0;

            let filterStartDate = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            let filterEndDate = endDate ? new Date(endDate) : new Date();

            filterStartDate.setUTCHours(0, 0, 0, 0);
            filterEndDate.setUTCHours(23, 59, 59, 999);

            const revenuePerDayData = await Order.aggregate([
                {
                    $match: {
                        order_status: "delivered",
                        createdAt: { $gte: filterStartDate, $lte: filterEndDate }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        total: { $sum: "$order_total_price" }
                    }
                },
                { $sort: { "_id": 1 } }
            ]);

            const allDates = [];
            let currentDate = new Date(filterStartDate);
            while (currentDate <= filterEndDate) {
                allDates.push(currentDate.toISOString().split("T")[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }

            const revenueMap = new Map(revenuePerDayData.map(item => [item._id, item.total]));
            const revenuePerDay = allDates.map(date => ({
                _id: date,
                total: revenueMap.get(date) || 0
            }));

            // Lấy top 5 sản phẩm bán chạy nhất
            const topSellingProducts = await Product.find()
                .sort({ product_sold: -1 })
                .limit(5)
                .select("product_name product_sold");

            // Doanh thu theo tháng
            const revenuePerMonthData = await Order.aggregate([
                {
                    $match: { order_status: "delivered" }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                        total: { $sum: "$order_total_price" }
                    }
                },
                { $sort: { "_id": 1 } }
            ]);

            return {
                stats: {
                    totalProducts,
                    totalUsers,
                    totalOrders,
                    totalPendingOrders,
                    totalDeliveredOrders,
                    totalRevenue, // ✅ Doanh thu chỉ tính trong tháng hiện tại
                    totalReviews,
                    totalApprovedReviews,
                    totalPendingReviews
                },
                revenuePerDay,
                revenuePerMonth: revenuePerMonthData,
                pendingReviews,
                topSellingProducts
            };
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu Dashboard:", error);
            throw new Error("Không thể lấy dữ liệu Dashboard");
        }
    }
}

module.exports = DashboardService;
