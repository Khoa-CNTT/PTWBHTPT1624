import { useEffect, useState } from 'react';
import { Pagination, TableSkeleton } from '../../../components';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import OfflineOrderListTable from './OfflineOrderListTable';
import { IOrder } from '../../../interfaces/order.interfaces';
import { apiGetAllOfflineOrders, apiGetOfflineOrderByCode } from '../../../services/order.service';  
import NotExit from '../../../components/common/NotExit';
import InputSearch from '../../../components/item/inputSearch';  

export default function OfflineOrderListManage() {
    const [offlineOrderLists, setOfflineOrderLists] = useState<IOrder[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');  // State để lưu giá trị tìm kiếm
    const [isSearching, setIsSearching] = useState<boolean>(false);  // Trạng thái tìm kiếm

    // Hàm fetch API đã được khai báo bên ngoài useEffect
    const fetchApi = async () => {
        setLoading(true);
        const res = await apiGetAllOfflineOrders({ limit: 5, page: currentPage });
        if (!res.success) {
            console.error('Lỗi khi lấy dữ liệu hóa đơn:', res.message);
            return;
        }
        const data = res.data;
        if (data && Array.isArray(data.orders)) {
            setOfflineOrderLists(data.orders);
            setTotalPage(data.totalPage);
        } else {
            console.error('Dữ liệu từ API không hợp lệ');
        }
        setLoading(false);
    };

    // Lấy danh sách hóa đơn tại quầy từ API khi trang hoặc trạng thái tìm kiếm thay đổi
    useEffect(() => {
        if (!isSearching) {
            fetchApi();
        }
    }, [currentPage, isSearching]);

    // Hàm xử lý thay đổi trong ô tìm kiếm
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value === '') {
            setIsSearching(false);
            fetchApi();
        }
    };

    // Hàm tìm kiếm đơn hàng theo mã
    const handleSearch = async () => {
        setLoading(true);
        if (!searchQuery.trim()) {
            console.error('Vui lòng nhập từ khoá tìm kiếm');
            return;
        }
        const res = await apiGetOfflineOrderByCode(searchQuery.trim());  // Sử dụng apiGetOfflineOrderByCode để tìm kiếm
        if (res.success) {
            const result = Array.isArray(res.data) ? res.data : [res.data];
            setOfflineOrderLists(result);  // Cập nhật danh sách đơn hàng với kết quả tìm kiếm
            setTotalPage(1);  // Nếu tìm thấy, chỉ có 1 trang
            setIsSearching(true);
        } else {
            console.error('Không tìm thấy đơn hàng:', res.message);
            setOfflineOrderLists([]);  // Nếu không tìm thấy đơn hàng, cập nhật danh sách là rỗng
            setTotalPage(0);  // Không có trang
        }
        setLoading(false);
    };

    if (loading) return <TableSkeleton />;

    return (
        <>
            <PageMeta title="Quản lý hóa đơn tại quầy" />
            <PageBreadcrumb pageTitle="Danh sách hóa đơn tại quầy" />
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                
                {/* Thêm ô tìm kiếm */}
                <div className="mb-4">
                    <InputSearch
                        searchQuery={searchQuery}  // Gắn giá trị tìm kiếm vào input
                        handleSearchChange={handleSearchChange}  // Xử lý thay đổi ô tìm kiếm
                        handleSearch={handleSearch}  // Gọi hàm tìm kiếm khi người dùng nhấn tìm kiếm
                    />
                </div>

                {offlineOrderLists.length > 0 ? (
                    <OfflineOrderListTable offlineOrder={offlineOrderLists} />
                ) : (
                    <NotExit />
                )}

                {totalPage > 0 && !isSearching && (
                    <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />
                )}
            </div>
        </>
    );
}
