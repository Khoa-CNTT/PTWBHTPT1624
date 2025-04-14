import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
  } from 'recharts';
  
  interface RevenueItem {
    _id: string;
    total: number;
  }
  
  interface RevenueChartProps {
    viewType: 'day' | 'month';
    onViewChange: (type: 'day' | 'month') => void;
    revenuePerDay: RevenueItem[];
    revenuePerMonth: RevenueItem[];
    offlineRevenuePerDay?: RevenueItem[];
    offlineRevenuePerMonth?: RevenueItem[];
  }
  
  export default function RevenueChart({
    viewType,
    onViewChange,
    revenuePerDay,
    revenuePerMonth,
    offlineRevenuePerDay = [],
    offlineRevenuePerMonth = [],
  }: RevenueChartProps) {
    // Hàm gộp dữ liệu để tính total = online + offline
    const mergeData = (
      onlineData: RevenueItem[],
      offlineData: RevenueItem[]
    ) => {
      const map = new Map<string, { _id: string; online: number; offline: number; total: number }>();
  
      onlineData.forEach(item => {
        map.set(item._id, {
          _id: item._id,
          online: item.total,
          offline: 0,
          total: item.total, // Tạm thời, sẽ cộng thêm offline sau
        });
      });
  
      offlineData.forEach(item => {
        const existing = map.get(item._id);
        if (existing) {
          existing.offline = item.total;
          existing.total += item.total;
        } else {
          map.set(item._id, {
            _id: item._id,
            online: 0,
            offline: item.total,
            total: item.total,
          });
        }
      });
  
      // Sắp xếp theo ngày/tháng tăng dần
      return Array.from(map.values()).sort((a, b) => a._id.localeCompare(b._id));
    };
  
    const chartData =
      viewType === 'day'
        ? mergeData(revenuePerDay, offlineRevenuePerDay)
        : mergeData(revenuePerMonth, offlineRevenuePerMonth);
  
    return (
      <div className="mt-10 bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Thống kê doanh thu</h2>
          <div className="space-x-2">
            <button
              className={`px-4 py-1 rounded ${
                viewType === 'day' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => onViewChange('day')}
            >
              Theo ngày
            </button>
            <button
              className={`px-4 py-1 rounded ${
                viewType === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => onViewChange('month')}
            >
              Theo tháng
            </button>
          </div>
        </div>
  
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#8884d8"
              name="Tổng doanh thu"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="online"
              stroke="#82ca9d"
              name="Doanh thu online"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="offline"
              stroke="#ffc658"
              name="Doanh thu tại quầy"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  