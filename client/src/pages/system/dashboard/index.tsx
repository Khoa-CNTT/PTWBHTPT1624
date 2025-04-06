import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import { apiGetDashboardStats } from '../../../services/dashboard.service';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardData, DashboardStats } from '../../../interfaces/dashboard.interface';
import { DashboardSkeleton } from '../../../components';

export default function DashboardManage() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [viewType, setViewType] = useState<'day' | 'month'>('day');
    const navigate = useNavigate();

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
        totalApprovedReviews: '',
        totalPendingReviews: '',
    };

    if (!dashboardData) return <DashboardSkeleton />;

    const handleViewChange = (type: 'day' | 'month') => {
        setViewType(type);
    };

    const handleProductClick = () => navigate('/quan-ly/san-pham');
    const handleUserClick = () => navigate('/quan-ly/nguoi-dung');
    const handleOrderClick = () => navigate('/quan-ly/don-hang');

    return (
        <>
            <PageMeta title="Tổng quan hệ thống" />
            <PageBreadcrumb pageTitle="Dashboard" />

            {/* Thống kê tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {dashboardData?.stats && (
                    <>
                        {([
                            {
                                key: 'totalProducts',
                                label: statLabels.totalProducts,
                                value: dashboardData.stats.totalProducts,
                                onClick: handleProductClick,
                            },
                            {
                                key: 'totalUsers',
                                label: statLabels.totalUsers,
                                value: dashboardData.stats.totalUsers,
                                onClick: handleUserClick,
                            },
                            {
                                key: 'totalOrders',
                                label: statLabels.totalOrders,
                                value:
                                    dashboardData.stats.totalPendingOrders +
                                    dashboardData.stats.totalDeliveredOrders,
                                onClick: handleOrderClick,
                                detail: [
                                    {
                                        icon: '📦',
                                        label: 'Chờ xử lý',
                                        value: dashboardData.stats.totalPendingOrders,
                                        color: 'text-yellow-600',
                                    },
                                    {
                                        icon: '✅',
                                        label: 'Đã giao',
                                        value: dashboardData.stats.totalDeliveredOrders,
                                        color: 'text-green-700',
                                    },
                                ],
                            },
                            {
                                key: 'totalRevenue',
                                label: statLabels.totalRevenue,
                                value: dashboardData.stats.totalRevenue,
                            },
                            {
                                key: 'totalReviews',
                                label: statLabels.totalReviews,
                                value:
                                    dashboardData.stats.totalApprovedReviews +
                                    dashboardData.stats.totalPendingReviews,
                                detail: [
                                    {
                                        icon: '✅',
                                        label: 'Đã duyệt',
                                        value: dashboardData.stats.totalApprovedReviews,
                                        color: 'text-green-600',
                                    },
                                    {
                                        icon: '⏳',
                                        label: 'Chờ duyệt',
                                        value: dashboardData.stats.totalPendingReviews,
                                        color: 'text-yellow-600',
                                    },
                                ],
                            },
                        ]).map(({ key, label, value, onClick, detail }, index) => (
                            <div
                                key={index}
                                className="relative group p-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
                                onClick={onClick}
                            >
                                <div className="text-sm text-gray-100">{label}</div>
                                <div className="text-3xl font-bold text-white">{value}</div>
                                {detail && (
                                    <div className="absolute left-0 top-full mt-2 w-full transform scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out z-10">
                                        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 space-y-2 text-sm">
                                            {detail.map((item, idx) => (
                                                <div key={idx} className="flex items-center space-x-2">
                                                    <span className={item.color}>{item.icon}</span>
                                                    <span className="text-gray-800">{item.label}:</span>
                                                    <span className="font-semibold text-gray-900">
                                                        {item.value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Doanh thu theo ngày/tháng */}
            <div className="mt-8 bg-white p-6 rounded-xl shadow-lg dark:border-white/[0.05] dark:bg-white/[0.05]">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-400 mb-4">
                    Doanh thu theo {viewType === 'day' ? 'ngày' : 'tháng'}
                </h3>
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
    // Lọc 12 tháng gần nhất
    dashboardData?.revenuePerMonth?.length ? (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.revenuePerMonth.slice(-12)}>
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
                                            <span className="text-yellow-500">🥇</span>
                                        ) : index === 1 ? (
                                            <span className="text-gray-400">🥈</span>
                                        ) : index === 2 ? (
                                            <span className="text-orange-500">🥉</span>
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
        </>
    );
}
