import { useEffect, useState } from 'react';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import { apiGetDashboardStats } from '../../../services/dashboard.service';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardData, DashboardStats } from '../../../interfaces/dashboard.interface';
import { DashboardSkeleton } from '../../../components';

export default function DashboardManage() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            const res = await apiGetDashboardStats();
            if (!res.success) return;
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

    if (!dashboardData) return <DashboardSkeleton />;

    return (
        <>
            <PageMeta title="Tổng quan hệ thống" />
            <PageBreadcrumb pageTitle="Dashboard" />

            {/* Thống kê tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {dashboardData?.stats &&
                    Object.entries(dashboardData.stats).map(([key, value]) => (
                        <div
                            key={key}
                            className="p-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">
                            <div className="text-sm text-gray-100">{statLabels[key as keyof DashboardStats]}</div>
                            <div className="text-3xl font-bold text-white">{value}</div>
                        </div>
                    ))}
            </div>

            {/* Biểu đồ doanh thu */}
            <div className="mt-8 bg-white p-6 rounded-xl shadow-lg  dark:border-white/[0.05] dark:bg-white/[0.05]">
                <h3 className="text-xl font-semibold text-gray-800  dark:text-gray-400 mb-4 ">Doanh thu theo ngày</h3>
                {dashboardData?.revenuePerDay?.length ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dashboardData.revenuePerDay}>
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="total" stroke="#4C6EF5" />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-center text-gray-500">Không có dữ liệu doanh thu</div>
                )}
            </div>

            {/* Top sản phẩm bán chạy */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Top sản phẩm bán chạy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                    {dashboardData?.topSellingProducts?.map((product) => (
                        <div
                            key={product._id}
                            className="p-6 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105">
                            <div className="text-lg    dark:text-gray-400 text-gray-800">{product.product_name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-600  ">{product.product_sold} lượt bán</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Đánh giá chờ duyệt */}
            <div className="mt-8 bg-white p-6 rounded-xl shadow-lg  dark:border-white/[0.05] dark:bg-white/[0.03]">
                <h3 className="text-xl font-semibold text-gray-800 mb-4  dark:text-gray-400">Đánh giá chờ duyệt</h3>
                {dashboardData?.pendingReviews?.length === 0 ? (
                    <div className="text-center text-gray-500  dark:text-gray-400">Không có đánh giá chờ duyệt</div>
                ) : (
                    dashboardData?.pendingReviews?.map((review, index) => (
                        <div
                            key={index}
                            className="p-4 mb-4  dark:text-gray-400 bg-gray-50 rounded-xl shadow-md hover:bg-gray-100 transition-all duration-300 ease-in-out">
                            <div className="text-sm text-gray-700">{review.content}</div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}
