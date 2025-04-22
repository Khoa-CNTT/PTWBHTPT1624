import { useEffect, useState } from 'react';
import { Pagination, TableSkeleton } from '../../../components';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import OfflineOrderListTable from './OfflineOrderListTable';
import { IOrder } from '../../../interfaces/order.interfaces';
import { apiGetAllOfflineOrders } from '../../../services/order.service';
import NotExit from '../../../components/common/NotExit';

export default function OfflineOrderListManage() {
    const [offlineOrderLists, setOfflineOrderLists] = useState<IOrder[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    // Lấy danh sách người dùng từ API
    useEffect(() => {
        const fetchApi = async () => {
            setLoading(true);
            const res = await apiGetAllOfflineOrders({ limit: 5, page: currentPage });
            if (!res.success) {
                console.error('Lỗi khi lấy dữ liệu người dùng:', res.message);
                return;
            }
            const data = res.data;
            // Kiểm tra dữ liệu trước khi cập nhật state
            if (data && Array.isArray(data.orders)) {
                setOfflineOrderLists(data.orders);
                setTotalPage(data.totalPage);
            } else {
                console.error('Dữ liệu từ API không hợp lệ');
            }
            setLoading(false);
        };
        fetchApi();
    }, [currentPage]);

    if (loading) return <TableSkeleton />;
    return (
        <>
            <PageMeta title="Quản lý hóa đơn tại quầy" />
            <PageBreadcrumb pageTitle="Hóa đơn bán hàng tại quầy" />
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                {offlineOrderLists.length > 0 ? <OfflineOrderListTable offlineOrder={offlineOrderLists} /> : <NotExit />}

                {totalPage > 0 && <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />}
            </div>
        </>
    );
}
