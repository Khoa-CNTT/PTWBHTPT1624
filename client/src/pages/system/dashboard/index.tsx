import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import { apiGetDashboardStats } from '../../../services/dashboard.service';
import { DashboardData } from '../../../interfaces/dashboard.interface';
import { DashboardSkeleton } from '../../../components';
import StatsOverview from './StatsOverview';
import RevenueChart from './RevenueChart';
import TopSellingProducts from './TopSellingProducts';

export default function DashboardManage() {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [viewType, setViewType] = useState<'day' | 'month'>('day');
    const [showTooltip, setShowTooltip] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const res = await apiGetDashboardStats();
            if (!res.success) return;
            setDashboardData(res.data);
        };
        fetchData();
    }, []);

    if (!dashboardData) return <DashboardSkeleton />;

    return (
        <>
            <PageMeta title="Tổng quan hệ thống" />
            <PageBreadcrumb pageTitle="Dashboard" />

            {/* Thống kê tổng quan */}
            <StatsOverview
                stats={dashboardData.stats}
                onProductClick={() => navigate('/quan-ly/san-pham')}
                onUserClick={() => navigate('/quan-ly/nguoi-dung')}
                onOrderClick={() => navigate('/quan-ly/don-hang')}
                onRevenueMouseEnter={() => setShowTooltip(true)}
                onRevenueMouseLeave={() => setShowTooltip(false)}
                showTooltip={showTooltip}
                revenuePerMonth={dashboardData.revenuePerMonth}
            />

            {/* Doanh thu theo ngày/tháng */}
            <RevenueChart
                viewType={viewType}
                onViewChange={setViewType}
                revenuePerDay={dashboardData.revenuePerDay}
                revenuePerMonth={dashboardData.revenuePerMonth}
            />

            {/* Top 5 sản phẩm bán chạy */}
            <TopSellingProducts topSellingProducts={dashboardData.topSellingProducts} />
        </>
    );
}
