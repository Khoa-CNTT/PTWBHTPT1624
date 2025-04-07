import { DashboardStats } from '../../../interfaces/dashboard.interface';

interface StatsOverviewProps {
    stats: DashboardStats;
    onProductClick: () => void;
    onUserClick: () => void;
    onOrderClick: () => void;
    onRevenueMouseEnter: () => void;
    onRevenueMouseLeave: () => void;
    showTooltip: boolean;
    revenuePerMonth: { _id: string; total: number }[];
}

const statLabels: Record<keyof DashboardStats, string> = {
    totalProducts: 'Tổng sản phẩm',
    totalUsers: 'Tổng người dùng',
    totalOrders: 'Tổng đơn hàng',
    totalPendingOrders: 'Đơn hàng chờ xử lý',
    totalDeliveredOrders: 'Đơn hàng đã giao',
    totalRevenue: 'Tổng doanh thu tháng này',
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
    const thisMonth = revenuePerMonth?.[revenuePerMonth.length - 1]?.total || 0;
    const lastMonth = revenuePerMonth?.[revenuePerMonth.length - 2]?.total || 0;
    const diff = thisMonth - lastMonth;
    const percentage =
        lastMonth === 0 ? 100 : Math.abs((diff / lastMonth) * 100).toFixed(1);
    const isIncrease = diff >= 0;

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
                            color: 'text-red-400',
                        },
                        {
                            icon: '⏳',
                            label: 'Cận hạn',
                            value: stats.lessThanOneMonthProducts,
                            color: 'text-yellow-400',
                        },
                        {
                            icon: '✅',
                            label: 'Còn hạn >1 tháng',
                            value: stats.moreThanOneMonthProducts,
                            color: 'text-green-400',
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
                            color: 'text-yellow-400',
                        },
                        {
                            icon: '✅',
                            label: 'Đã giao',
                            value: stats.totalDeliveredOrders,
                            color: 'text-green-400',
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
                            color: 'text-green-400',
                        },
                        {
                            icon: '⏳',
                            label: 'Chờ duyệt',
                            value: stats.totalPendingReviews,
                            color: 'text-yellow-400',
                        },
                    ],
                },
            ]).map(({ key, label, value, onClick, detail, onMouseEnter, onMouseLeave }, index) => (
                <div
                    key={index}
                    className="group p-6 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                    onClick={onClick}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                >
                    <div className="text-sm text-gray-100">{label}</div>
                    <div className="text-3xl font-bold text-white">
                        {value.toLocaleString()}
                        {key === 'totalRevenue' && ' VND'}
                    </div>

                    {/* Hiển thị % chênh lệch cho ô doanh thu */}
                    {key === 'totalRevenue' && (
                        <div className="mt-2 text-sm font-medium flex items-center space-x-1 text-white">
                            <span
                                className={`flex items-center ${
                                    isIncrease ? 'text-green-300' : 'text-red-300'
                                }`}
                            >
                                {isIncrease ? '▲' : '▼'} {percentage}%
                            </span>
                            <span className="text-gray-200">(so với tháng trước)</span>
                        </div>
                    )}

                    {/* Tooltip chi tiết nội dung phụ trong box */}
                    {detail && (
                        <div className="hidden group-hover:flex flex-col gap-1 mt-3 transition-all duration-200">
                            {detail.map((item, idx) => (
                                <div key={idx} className="flex items-center space-x-2 text-sm">
                                    <span className={item.color}>{item.icon}</span>
                                    <span className="text-gray-100">{item.label}:</span>
                                    <span className="font-semibold text-white">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tooltip cho tổng doanh thu hiển thị trong box */}
                    {key === 'totalRevenue' && showTooltip && (
                        <div className="hidden group-hover:flex flex-col gap-1 mt-3 transition-all duration-200">
                            <div className="text-sm font-semibold text-white">
                                Doanh thu 3 tháng gần nhất:
                            </div>
                            {revenuePerMonth?.slice(-3).map((monthData, index) => (
                                <div key={index} className="flex items-center space-x-2 text-sm">
                                    <span className="text-gray-100">Tháng {monthData._id}:</span>
                                    <span className="font-semibold text-white">
                                        {monthData.total.toLocaleString()} VND
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
