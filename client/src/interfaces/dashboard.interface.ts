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
  expiredProducts: number; // Sản phẩm đã hết hạn
  lessThanOneMonthProducts: number; // Sản phẩm cận hạn (dưới 1 tháng)
  moreThanOneMonthProducts: number; // Sản phẩm còn hạn trên 1 tháng
}

export interface RevenuePerDay {
  _id: string; // ngày
  total: number;
}

export interface RevenuePerMonth {
  _id: string; // tháng (yyyy-MM)
  total: number;
}

export interface TopSellingProduct {
  _id: string;
  product_name: string;
  product_sold: number;
}

export interface Review {
  content: string;
}

export interface DashboardData {
  stats: DashboardStats;
  revenuePerDay: RevenuePerDay[];
  revenuePerMonth: RevenuePerMonth[];
  topSellingProducts: TopSellingProduct[];
  pendingReviews: Review[];
}
