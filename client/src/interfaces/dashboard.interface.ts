export interface DashboardStats {
    totalProducts: number;
    totalUsers: number;
    totalOrders: number;
    totalPendingOrders: number;
    totalDeliveredOrders: number;
    totalRevenue: number;
    totalReviews: number;
    totalApprovedReviews: number;
    totalPendingReviews: number;
}

export interface RevenuePerDay {
    _id: string; // ngày, ví dụ: "2025-04-05"
    total: number; // doanh thu trong ngày đó
}

export interface RevenuePerMonth {
    _id: string; // tháng, ví dụ: "2025-04"
    total: number; // doanh thu trong tháng đó
}

export interface TopSellingProduct {
    _id: string;
    product_name: string;
    product_sold: number;
}

export interface Review {
    content: string;
    // bạn có thể thêm nhiều field hơn tùy vào dữ liệu API
}

export interface DashboardData {
    stats: DashboardStats;
    revenuePerDay: RevenuePerDay[];
    revenuePerMonth: RevenuePerMonth[]; // 👈 Thêm dòng này
    topSellingProducts: TopSellingProduct[];
    pendingReviews: Review[];
}
