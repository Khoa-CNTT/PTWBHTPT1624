import { useEffect, useState } from 'react';
import { Pagination, TableSkeleton } from '../../../components';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import OfflineOrderListTable from './OfflineOrderListTable';
import { IOrder } from '../../../interfaces/order.interfaces';
import { apiGetAllOfflineOrders } from '../../../services/order.service';

export default function OfflineOrderListManage() {
    const [offlineOrderLists, setOfflineOrderLists] = useState<IOrder[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);

    // Lấy danh sách người dùng từ API
    useEffect(() => {
        const fetchApi = async () => {
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
        };
        fetchApi();
    }, [currentPage]);

    if (offlineOrderLists.length === 0) return <TableSkeleton />;

    return (
        <>
            <PageMeta title="Quản lý người dùng" />
            <PageBreadcrumb pageTitle="Người dùng" />
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <OfflineOrderListTable offlineOrder={offlineOrderLists} />
                {totalPage > 0 && <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />}
            </div>
        </>
    );
}
