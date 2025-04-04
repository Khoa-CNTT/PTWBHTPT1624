import { useEffect, useState } from 'react';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import { apiGetDashboardStats } from '../../../services/dashboard.service';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardStats {
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

interface RevenuePerDay {
    _id: string; // ngày
    total: number; // doanh thu trong ngày đó
}

interface TopSellingProduct {
    _id: string;
    product_name: string;
    product_sold: number;
}

interface Review {
    content: string;
    // bạn có thể thêm nhiều field hơn tùy vào dữ liệu API
}

interface DashboardData {
    stats: DashboardStats;
    revenuePerDay: RevenuePerDay[];
    topSellingProducts: TopSellingProduct[];
    pendingReviews: Review[];
}

export default function DashboardManage() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await apiGetDashboardStats();
            if (!res.success) return;
            console.log('res', res);
            setDashboardData(res.data);
        };
        fetchData();
    }, []);

    const statLabels: Record<keyof DashboardStats, string> = {
        totalProducts: 'Tổng sản phẩm',
        totalUsers: 'Tổng người dùng',
        totalOrders: 'Tổng đơn hàng',
        totalPendingOrders: 'Đơn hàng chờ xử lý',
        totalDeliveredOrders: 'Đơn hàng đã giao',
        totalRevenue: 'Tổng doanh thu',
        totalReviews: 'Tổng đánh giá',
        totalApprovedReviews: 'Đánh giá đã duyệt',
        totalPendingReviews: 'Đánh giá chờ duyệt',
    };

    return (
        <>
            <PageMeta title="Tổng quan hệ thống" />
            <PageBreadcrumb pageTitle="Dashboard" />

            {/* Thống kê tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {dashboardData?.stats &&
                    Object.entries(dashboardData.stats).map(([key, value]) => (
                        <div key={key} className="p-4 bg-white rounded-xl shadow-sm">
                            <div className="text-sm text-gray-500">{statLabels[key as keyof DashboardStats]}</div>
                            <div className="text-2xl font-semibold">{value}</div>
                        </div>
                    ))}
            </div>

            {/* Biểu đồ doanh thu */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Doanh thu theo ngày</h3>
                {dashboardData?.revenuePerDay?.length ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dashboardData.revenuePerDay}>
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="total" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div>Không có dữ liệu doanh thu</div>
                )}
            </div>

            {/* Top sản phẩm bán chạy */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Top sản phẩm bán chạy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dashboardData?.topSellingProducts?.map((product) => (
                        <div key={product._id} className="p-4 bg-white rounded-xl shadow-sm flex justify-between items-center">
                            <div>{product.product_name}</div>
                            <div className="font-bold">{product.product_sold} lượt bán</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Đánh giá chờ duyệt */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Đánh giá chờ duyệt</h3>
                {dashboardData?.pendingReviews?.length === 0 ? (
                    <div>Không có đánh giá chờ duyệt</div>
                ) : (
                    dashboardData?.pendingReviews?.map((review, index) => (
                        <div key={index} className="p-4 bg-white rounded-xl shadow-sm">
                            <div>{review.content}</div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}
