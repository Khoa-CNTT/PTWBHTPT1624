import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

interface RevenueChartProps {
    viewType: 'day' | 'month';
    onViewChange: (type: 'day' | 'month') => void;
    revenuePerDay: any[];
    revenuePerMonth: any[];
}

export default function RevenueChart({
    viewType,
    onViewChange,
    revenuePerDay,
    revenuePerMonth,
}: RevenueChartProps) {
    return (
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg dark:border-white/[0.05] dark:bg-white/[0.05]">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-400 mb-4">
                Doanh thu theo {viewType === 'day' ? 'ngày' : 'tháng'}
            </h3>
            <div className="mb-4">
                <button
                    className={`mr-4 px-4 py-2 rounded-lg ${viewType === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => onViewChange('day')}
                >
                    Theo ngày
                </button>
                <button
                    className={`px-4 py-2 rounded-lg ${viewType === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => onViewChange('month')}
                >
                    Theo tháng
                </button>
            </div>

            {viewType === 'day' ? (
                revenuePerDay.length ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenuePerDay}>
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
                revenuePerMonth.length ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenuePerMonth.slice(-6).reverse()}>
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
    );
}
