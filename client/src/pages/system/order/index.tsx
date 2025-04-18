import React, { useEffect, useState } from 'react';
import { apiGetAllOrders, apiUpdateOrderStatus, apiGetOrderByCode } from '../../../services/order.service'; // Import API tìm kiếm theo orderCode
import { IOrder } from '../../../interfaces/order.interfaces';
import { ButtonOutline, showNotification, TableSkeleton } from '../../../components';
import OrderTable from './OrderTable';
import { formatMoney } from '../../../utils/formatMoney';
import { statusOrder } from '../../../utils/statusOrder';
import * as XLSX from 'xlsx';
import NotExit from '../../../components/common/NotExit';
import InputSearch from '../../../components/inputSearch';  // Thêm import cho ô tìm kiếm

const OrderManage: React.FC = () => {
    const SELL_TAB = [
        { tab: '', title: 'Tất cả' },
        { tab: 'pending', title: 'Chờ xác nhận' },
        { tab: 'confirm', title: 'Vận Chuyển' },
        { tab: 'shipped', title: 'Đã giao hàng' },
        { tab: 'delivered', title: 'Thành công' },
        { tab: 'cancelled', title: 'Đã hủy' },
    ];
    const updateStatus: Record<string, string> = {
        pending: 'confirm',
        confirm: 'shipped',
        shipped: 'delivered',
    };

    const [orders, setOrders] = useState<IOrder[]>([]);
    const [displayTab, setDisplayTab] = useState<string>(''); // Tab hiện tại
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>(''); // State cho tìm kiếm
    const [isSearching, setIsSearching] = useState<boolean>(false); // Kiểm tra đang tìm kiếm hay không

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const res = await apiGetAllOrders(displayTab); // Lấy đơn hàng theo tab
            if (res.success) {
                setOrders(res.data);
            }
            setLoading(false);
        };

        fetchOrders(); // Lấy lại tất cả đơn hàng khi trang được load hoặc khi thay đổi tab
    }, [displayTab]); // Khi thay đổi tab, gọi lại API

    const handleUpdateStatus = async (id: string) => {
        if (!confirm('Bạn có muốn xác nhận không?')) return;

        const res = await apiUpdateOrderStatus({ orderId: id, newStatus: updateStatus[displayTab] });
        if (!res.success) {
            showNotification(res.message);
            return;
        }

        // Cập nhật lại trạng thái đơn hàng trong danh sách
        setOrders((prev) => prev.map((order) => order._id === id ? { ...order, status: updateStatus[displayTab] } : order));

        showNotification('Cập nhật thành công', true);
    };

    const handleExportFile = () => {
        if (!confirm('Bạn có muốn xuất đơn hàng không?')) return;
        const wb = XLSX.utils.book_new();
        const products = orders.map((or) => {
            const titleProducts = or.order_products.map((p) => {
                return `${p.productId?.product_name} - số lượng ${p.quantity}`;
            });
            return {
                'Mã hàng': or.order_code,
                'Tên khách hàng': or.order_shipping_address.fullName,
                'Địa chỉ nhận hàng': or.order_shipping_address.detailAddress,
                'Số điện thoại': or.order_shipping_address.phone,
                'Trạng thái': statusOrder(or)?.title,
                'Tên hàng/số lượng': titleProducts.join(', '),
                'Tổng tiền': formatMoney(or.order_total_price),
            };
        });
        const ws = XLSX.utils.json_to_sheet(products);
        XLSX.utils.book_append_sheet(wb, ws, 'ssss');
        XLSX.writeFile(wb, 'test.xlsx');
        showNotification('Không có đơn hàng nào!', true);
    };

    // Xử lý ô tìm kiếm
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value); // Cập nhật khi thay đổi ô tìm kiếm
    };

    const handleSearch = async () => {
        setLoading(true); // Đánh dấu đang tải dữ liệu
        setIsSearching(true); // Đánh dấu đang trong quá trình tìm kiếm

        if (searchQuery.trim()) {
            try {
                const res = await apiGetOrderByCode(searchQuery.trim()); // Gọi API tìm kiếm theo mã đơn hàng
                if (res.success) {
                    const result = Array.isArray(res.data) ? res.data : [res.data];
                    setOrders(result); // Cập nhật danh sách đơn hàng

                    // Kiểm tra trạng thái của đơn hàng và chuyển tới tab phù hợp
                    const firstOrder = result[0];
                    if (firstOrder) {
                        const orderStatus = firstOrder.status;
                        // Nếu có trạng thái cụ thể, chuyển sang tab đó
                        if (SELL_TAB.some((tab) => tab.tab === orderStatus)) {
                            setDisplayTab(orderStatus); // Chuyển tới tab trạng thái của đơn hàng
                        } else {
                            setDisplayTab(''); // Nếu không có trạng thái cụ thể, quay lại tab "Tất cả"
                        }
                    }
                } else {
                    showNotification(res.message || 'Không tìm thấy đơn hàng', false);
                    setOrders([]); // Nếu không tìm thấy đơn hàng
                }
            } catch (err) {
                console.error('Lỗi tìm kiếm:', err);
                showNotification('Lỗi khi tìm kiếm đơn hàng', false);
            }
        } else {
            // Nếu không có từ khóa tìm kiếm (tức là xóa ô tìm kiếm)
            setIsSearching(false);
            const res = await apiGetAllOrders(displayTab); // Lấy lại danh sách đơn hàng theo tab hiện tại
            if (res.success) {
                setOrders(res.data); // Cập nhật lại danh sách đơn hàng
            }
        }

        setLoading(false); // Kết thúc quá trình tải dữ liệu
    };

    useEffect(() => {
        if (!isSearching && searchQuery === '') {
            // Tải lại tất cả đơn hàng khi ô tìm kiếm trống
            const fetchOrders = async () => {
                const res = await apiGetAllOrders(displayTab);
                if (res.success) {
                    setOrders(res.data);
                }
            };
            fetchOrders();
        }
    }, [searchQuery, isSearching, displayTab]);

    if (loading) return <TableSkeleton />;

    return (
        <div className="fixed-mobile w-full dark:border-white/[0.05] dark:bg-white/[0.03] h-full bg-white overflow-y-scroll tablet:overflow-y-scroll">
            {/* Ô tìm kiếm (đã chuyển lên trên) */}
            <div className="px-5 py-4">
                <InputSearch handleSearch={handleSearch} handleSearchChange={handleSearchChange} searchQuery={searchQuery} />
            </div>

            {/* Tab lọc đơn hàng (sẽ hiển thị dưới thanh tìm kiếm) */}
            <div className="tablet:flex tablet:bg-white laptop:w-full sticky top-0 grid grid-cols-6 dark:border-white/[0.05] dark:bg-white/[0.03] bg-white rounded-sm overflow-hidden">
                {SELL_TAB.map((e, idx) => (
                    <div
                        key={idx}
                        className={`flex tablet:w-4/12 laptop:w-full justify-center text-sm items-center py-2 border-b-[2px] cursor-pointer
              ${displayTab === e.tab ? 'text-primary border-primary' : 'text-secondary border-transparent'}`}
                        onClick={() => setDisplayTab(e.tab)} // Chuyển đổi tab
                    >
                        {e.title}
                    </div>
                ))}
            </div>
            
            {/* Danh sách đơn hàng */}
            {orders.length > 0 ? (
                <div className="flex flex-col gap-5 w-full">
                    <OrderTable orders={orders} tab={displayTab} onChangeStatus={handleUpdateStatus} />
                    {/* Nút export nếu có đơn hàng */}
                    {orders.length > 0 && (
                        <ButtonOutline onClick={handleExportFile} className="mx-auto my-4">
                            Xuất đơn hàng
                        </ButtonOutline>
                    )}
                </div>
            ) : (
                <NotExit />
            )}
        </div>
    );
};

export default OrderManage;
