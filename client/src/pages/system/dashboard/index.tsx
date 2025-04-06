import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Thêm useNavigate từ react-router-dom
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import { apiGetDashboardStats } from '../../../services/dashboard.service';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardData, DashboardStats } from '../../../interfaces/dashboard.interface';
import { DashboardSkeleton } from '../../../components';

export default function DashboardManage() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [viewType, setViewType] = useState<'day' | 'month'>('day');
    const navigate = useNavigate();  // Sử dụng useNavigate để điều hướng

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

    const handleViewChange = (type: 'day' | 'month') => {
        setViewType(type);
    };

    const handleProductClick = () => {
        navigate('/quan-ly/san-pham');  // Điều hướng đến trang quản lý sản phẩm
    };

    const handleUserClick = () => {
        navigate('/quan-ly/nguoi-dung');  // Điều hướng đến trang quản lý người dùng
    };

    const handleOrderClick = () => {
        navigate('/quan-ly/don-hang');  // Điều hướng đến trang quản lý đơn hàng
    };

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
                            className="p-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
                            onClick={
                                key === 'totalProducts' ? handleProductClick :
                                key === 'totalUsers' ? handleUserClick :
                                key === 'totalOrders' ? handleOrderClick : undefined
                            }  // Thêm sự kiện onClick cho "Tổng đơn hàng"
                        >
                            <div className="text-sm text-gray-100">{statLabels[key as keyof DashboardStats]}</div>
                            <div className="text-3xl font-bold text-white">{value}</div>
                        </div>
                    ))}
            </div>

            {/* Doanh thu theo ngày/tháng */}
            <div className="mt-8 bg-white p-6 rounded-xl shadow-lg  dark:border-white/[0.05] dark:bg-white/[0.05]">
                <h3 className="text-xl font-semibold text-gray-800  dark:text-gray-400 mb-4 ">Doanh thu theo {viewType === 'day' ? 'ngày' : 'tháng'}</h3>

                {/* Buttons to switch between day and month */}
                <div className="mb-4">
                    <button
                        className={`mr-4 px-4 py-2 rounded-lg ${viewType === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleViewChange('day')}
                    >
                        Theo ngày
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg ${viewType === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => handleViewChange('month')}
                    >
                        Theo tháng
                    </button>
                </div>

                {viewType === 'day' ? (
                    dashboardData?.revenuePerDay?.length ? (
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
                    )
                ) : (
                    dashboardData?.revenuePerMonth?.length ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dashboardData.revenuePerMonth}>
                                <XAxis dataKey="_id" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="total" stroke="#4C6EF5" />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center text-gray-500">Không có dữ liệu doanh thu</div>
                    )
                )}
            </div>

            {/* Top 5 sản phẩm bán chạy */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Top 5 sản phẩm bán chạy</h3>
                <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <table className="min-w-full table-auto text-left">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-gray-800 dark:text-white">#</th>
                                <th className="px-4 py-2 text-gray-800 dark:text-white">Tên sản phẩm</th>
                                <th className="px-4 py-2 text-gray-800 dark:text-white">Số lượng bán</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dashboardData?.topSellingProducts?.slice(0, 5).map((product, index) => (
                                <tr key={product._id} className="border-t border-gray-200 dark:border-gray-600">
                                    <td className="px-4 py-2 text-gray-800 dark:text-white">
                                        {index === 0 ? (
                                            <span className="text-yellow-500">🥇</span>  // Huy chương vàng
                                        ) : index === 1 ? (
                                            <span className="text-gray-400">🥈</span>  // Huy chương bạc
                                        ) : index === 2 ? (
                                            <span className="text-orange-500">🥉</span>  // Huy chương đồng
                                        ) : (
                                            index + 1
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-white">{product.product_name}</td>
                                    <td className="px-4 py-2 text-gray-800 dark:text-white">{product.product_sold}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
