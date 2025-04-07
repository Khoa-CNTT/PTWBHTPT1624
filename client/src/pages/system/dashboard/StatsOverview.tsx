import { DashboardStats } from '../../../interfaces/dashboard.interface';

interface StatsOverviewProps {
    stats: DashboardStats;
    onProductClick: () => void;
    onUserClick: () => void;
    onOrderClick: () => void;
    onRevenueMouseEnter: () => void;
    onRevenueMouseLeave: () => void;
    showTooltip: boolean;
    revenuePerMonth: any[];
}

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
    expiredProducts: 'Sản phẩm hết hạn',
    lessThanOneMonthProducts: 'Sản phẩm cận hạn',
    moreThanOneMonthProducts: 'Sản phẩm còn hạn >1 tháng',
};

export default function StatsOverview({
    stats,
    onProductClick,
    onUserClick,
    onOrderClick,
    onRevenueMouseEnter,
    onRevenueMouseLeave,
    showTooltip,
    revenuePerMonth,
}: StatsOverviewProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {([
                {
                    key: 'totalProducts',
                    label: statLabels.totalProducts,
                    value: stats.totalProducts,
                    onClick: onProductClick,
                    detail: [
                        {
                            icon: '❌',
                            label: 'Hết hạn',
                            value: stats.expiredProducts,
                            color: 'text-red-600',
                        },
                        {
                            icon: '⏳',
                            label: 'Cận hạn',
                            value: stats.lessThanOneMonthProducts,
                            color: 'text-yellow-600',
                        },
                        {
                            icon: '✅',
                            label: 'Còn hạn >1 tháng',
                            value: stats.moreThanOneMonthProducts,
                            color: 'text-green-600',
                        },
                    ],
                },
                {
                    key: 'totalUsers',
                    label: statLabels.totalUsers,
                    value: stats.totalUsers,
                    onClick: onUserClick,
                },
                {
                    key: 'totalOrders',
                    label: statLabels.totalOrders,
                    value: stats.totalPendingOrders + stats.totalDeliveredOrders,
                    onClick: onOrderClick,
                    detail: [
                        {
                            icon: '📦',
                            label: 'Chờ xử lý',
                            value: stats.totalPendingOrders,
                            color: 'text-yellow-600',
                        },
                        {
                            icon: '✅',
                            label: 'Đã giao',
                            value: stats.totalDeliveredOrders,
                            color: 'text-green-700',
                        },
                    ],
                },
                {
                    key: 'totalRevenue',
                    label: statLabels.totalRevenue,
                    value: stats.totalRevenue,
                    onMouseEnter: onRevenueMouseEnter,
                    onMouseLeave: onRevenueMouseLeave,
                },
                {
                    key: 'totalReviews',
                    label: statLabels.totalReviews,
                    value: stats.totalApprovedReviews + stats.totalPendingReviews,
                    detail: [
                        {
                            icon: '✅',
                            label: 'Đã duyệt',
                            value: stats.totalApprovedReviews,
                            color: 'text-green-600',
                        },
                        {
                            icon: '⏳',
                            label: 'Chờ duyệt',
                            value: stats.totalPendingReviews,
                            color: 'text-yellow-600',
                        },
                    ],
                },
            ]).map(({ key, label, value, onClick, detail, onMouseEnter, onMouseLeave }, index) => (
                <div
                    key={index}
                    className="relative group p-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
                    onClick={onClick}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    <div className="text-sm text-gray-100">{label}</div>
                    <div className="text-3xl font-bold text-white">{value}</div>

                    {/* Tooltip cho các ô khác */}
                    {detail && (
                        <div className="absolute inset-0 flex items-center justify-center p-4 transform scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out z-10">
                            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 space-y-2 text-sm w-full">
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

                    {/* Tooltip cho tổng doanh thu */}
                    {key === 'totalRevenue' && showTooltip && (
                        <div className="absolute inset-0 flex items-center justify-center p-4 transform scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out z-10">
                            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 space-y-2 text-sm w-full">
                                <div className="font-semibold">Doanh thu 6 tháng gần nhất:</div>
                                {revenuePerMonth?.slice(-6).map((monthData, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <span className="text-gray-800">Tháng {monthData._id}:</span>
                                        <span className="font-semibold text-gray-900">
                                            {monthData.total.toLocaleString()} VND
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
