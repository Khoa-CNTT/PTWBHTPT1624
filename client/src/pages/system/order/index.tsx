/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { apiGetAllOrders, apiGetOrderByCode, apiUpdateOrderStatus } from '../../../services/order.service';
import { IOrder } from '../../../interfaces/order.interfaces';
import { ButtonOutline, showNotification, TableSkeleton } from '../../../components';
import OrderTable from './OrderTable';
import { formatMoney } from '../../../utils/formatMoney';
import { statusOrder, statusOrderNotification } from '../../../utils/statusOrder';
import * as XLSX from 'xlsx';
import NotExit from '../../../components/common/NotExit';
import InputSearch from '../../../components/item/inputSearch';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import { INotification } from '../../../interfaces/notification.interfaces';
import { sendNotificationToUser } from '../../../services/notification.service';

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
    const [displayTab, setDisplayTab] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isSearching, setIsSearching] = useState<boolean>(false);

    // Hàm fetch API đã được khai báo bên ngoài useEffect
    const fetchOrders = async () => {
        setLoading(true);
        const res = await apiGetAllOrders(displayTab);
        if (res.success) setOrders(res.data);
        setLoading(false);
    };

    useEffect(() => {
        if (!isSearching) {
            fetchOrders();
        }
    }, [displayTab, isSearching]);

    // Hàm xử lý thay đổi trong ô tìm kiếm
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value === '') {
            setIsSearching(false);
            fetchOrders();
        }
    };

    // Hàm tìm kiếm đơn hàng theo mã
    const handleSearch = async () => {
        setLoading(true);
        if (!searchQuery.trim()) {
            console.error('Vui lòng nhập từ khoá tìm kiếm');
            return;
        }
        const res = await apiGetOrderByCode(searchQuery.trim()); // Sử dụng apiGetOrderByCode để tìm kiếm
        if (res.success) {
            const result = Array.isArray(res.data) ? res.data : [res.data];
            setOrders(result); // Cập nhật danh sách đơn hàng với kết quả tìm kiếm
            setIsSearching(true);
        } else {
            console.error('Không tìm thấy đơn hàng:', res.message);
            setOrders([]); // Nếu không tìm thấy đơn hàng, cập nhật danh sách là rỗng
        }
        setLoading(false);
    };

    const handleUpdateStatus = async (id: string) => {
        if (!confirm('Bạn có muốn xác nhận không?')) return;
        const res = await apiUpdateOrderStatus({ orderId: id, newStatus: updateStatus[displayTab] });
        if (!res.success) return showNotification(res.message, res.success);
        setOrders((prev) => prev.filter((order) => order._id !== id));
        const notification: INotification = {
            notification_user: res?.data?.order_user,
            notification_title: '🚚 Cập nhật trạng thái đơn hàng',
            notification_subtitle: `📦 Đơn hàng của bạn đã được cập nhật: ${statusOrderNotification(res?.data?.order_status)} ✅ • Cảm ơn bạn đã mua sắm! 🎉`,
            notification_imageUrl:
                'https://geso.us/wp-content/uploads/2024/06/1-quan-ly-don-hang-hieu-qua-giup-doanh-nghiep-kiem-soat-toan-bo-quy-trinh-ban-hang.jpg',
            notification_link: `/nguoi-dung/chi-tiet-don-hang/${id}`,
        };
        await sendNotificationToUser(res?.data?.order_user, notification);
        showNotification('Cập nhật thành công', true);
    };

    const handleExportFile = () => {
        if (!confirm('Bạn có muốn xuất đơn hàng không?')) return;
        const wb = XLSX.utils.book_new();
        const products = orders.map((or) => {
            const titleProducts = or.order_products.map((p) => `${p.productId?.product_name} - số lượng ${p.quantity}`);
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
        XLSX.utils.book_append_sheet(wb, ws, 'Đơn hàng');
        XLSX.writeFile(wb, 'don-hang.xlsx');
        showNotification('Xuất đơn hàng thành công!', true);
    };

    if (loading) return <TableSkeleton />;

    return (
        <>
            <PageMeta title="Quản lý đơn hàng" />
            <PageBreadcrumb pageTitle="Danh sách đơn hàng" />
            <div className="fixed-mobile w-full dark:border-white/[0.05] dark:bg-white/[0.03] h-full bg-white overflow-y-scroll tablet:overflow-y-scroll">
                <div className="px-5 py-4">
                    <InputSearch handleSearch={handleSearch} handleSearchChange={handleSearchChange} searchQuery={searchQuery} />
                </div>

                <div className="tablet:flex tablet:bg-white laptop:w-full sticky top-0 grid grid-cols-6 dark:border-white/[0.05] dark:bg-white/[0.03] bg-white rounded-sm overflow-hidden">
                    {SELL_TAB.map((e, idx) => (
                        <div
                            key={idx}
                            className={`flex tablet:w-4/12 laptop:w-full justify-center text-sm items-center py-2 border-b-[2px] cursor-pointer
              ${displayTab === e.tab ? 'text-primary border-primary' : 'text-secondary border-transparent'}`}
                            onClick={() => setDisplayTab(e.tab)}>
                            {e.title}
                        </div>
                    ))}
                </div>

                {orders.length > 0 ? (
                    <div className="flex flex-col gap-5 w-full">
                        <OrderTable orders={orders} tab={displayTab} onChangeStatus={handleUpdateStatus} />

                        <ButtonOutline onClick={handleExportFile} className="mx-auto my-4">
                            Xuất đơn hàng
                        </ButtonOutline>
                    </div>
                ) : (
                    <NotExit />
                )}
            </div>
        </>
    );
};

export default OrderManage;
