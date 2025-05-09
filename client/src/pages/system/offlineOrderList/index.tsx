import { useEffect, useState } from 'react';
import { Pagination, TableSkeleton } from '../../../components';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import OfflineOrderListTable from './OfflineOrderListTable';
import { IOrder } from '../../../interfaces/order.interfaces';
import { apiGetAllOfflineOrders, apiGetOfflineOrderByCode } from '../../../services/order.service';
import NotExit from '../../../components/common/NotExit';
import InputSearch from '../../../components/item/inputSearch';
import { showNotification } from '../../../components';

export default function OfflineOrderListManage() {
    const [offlineOrderLists, setOfflineOrderLists] = useState<IOrder[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>(''); // State để lưu giá trị tìm kiếm
    const [isSearching, setIsSearching] = useState<boolean>(false); // Trạng thái tìm kiếm

    // Hàm fetch API đã được khai báo bên ngoài useEffect
    const fetchApi = async () => {
        setLoading(true);
        const res = await apiGetAllOfflineOrders({ limit: 10, page: currentPage });
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
    // Hàm xử lý thay đổi trong ô tìm kiếm
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value === '') {
            setIsSearching(false);
            fetchApi(); // Gọi lại API để lấy tất cả dữ liệu khi tìm kiếm trống
        }
    };

    // Hàm tìm kiếm đơn hàng theo mã
    // Hàm tìm kiếm đơn hàng theo mã
    const handleSearch = async () => {
        // Kiểm tra nếu từ khóa tìm kiếm trống, hiển thị thông báo và không gọi API
        if (!searchQuery.trim()) {
            showNotification('Vui lòng nhập từ khoá tìm kiếm', false); // Thông báo khi không có từ khóa
            return;
        }

        setLoading(true); // Hiển thị loading khi tìm kiếm

        // Gửi request tìm kiếm đơn hàng theo mã
        const res = await apiGetOfflineOrderByCode(searchQuery.trim());
        if (res.success) {
            // Nếu tìm thấy đơn hàng, cập nhật danh sách và phân trang
            const result = Array.isArray(res.data) ? res.data : [res.data];
            setOfflineOrderLists(result);
            setTotalPage(1); // Chỉ có một trang khi tìm thấy kết quả
            setIsSearching(true);
        } else {
            // Nếu không tìm thấy đơn hàng, cập nhật danh sách là rỗng
            console.error('Không tìm thấy đơn hàng:', res.message);
            setOfflineOrderLists([]); // Xóa danh sách cũ
            setTotalPage(0); // Không có trang
        }

        setLoading(false); // Tắt loading
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
                        searchQuery={searchQuery} // Gắn giá trị tìm kiếm vào input
                        handleSearchChange={handleSearchChange} // Xử lý thay đổi ô tìm kiếm
                        handleSearch={handleSearch} // Gọi hàm tìm kiếm khi người dùng nhấn tìm kiếm
                    />
                </div>

                {offlineOrderLists.length > 0 ? <OfflineOrderListTable offlineOrder={offlineOrderLists} /> : <NotExit />}

                {totalPage > 1 && !isSearching && <Pagination currentPage={currentPage} totalPage={totalPage - 1} setCurrentPage={setCurrentPage} />}
            </div>
        </>
    );
}
