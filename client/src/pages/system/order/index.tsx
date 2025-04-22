import React, { useEffect, useState } from 'react';
import { apiGetAllOrders, apiUpdateOrderStatus, apiGetOrderByCode } from '../../../services/order.service';
import { IOrder } from '../../../interfaces/order.interfaces';
import { ButtonOutline, showNotification, TableSkeleton } from '../../../components';
import OrderTable from './OrderTable';
import { formatMoney } from '../../../utils/formatMoney';
import { statusOrder } from '../../../utils/statusOrder';
import * as XLSX from 'xlsx';
import NotExit from '../../../components/common/NotExit';
import InputSearch from '../../../components/inputSearch';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';

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

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const res = await apiGetAllOrders(displayTab);
            if (res.success) setOrders(res.data);
            setLoading(false);
        };
        fetchOrders();
    }, [displayTab]);

    const handleUpdateStatus = async (id: string) => {
        if (!confirm('Bạn có muốn xác nhận không?')) return;
        const res = await apiUpdateOrderStatus({ orderId: id, newStatus: updateStatus[displayTab] });
        if (!res.success) return showNotification(res.message);
        setOrders(prev => prev.map(order => order._id === id ? { ...order, status: updateStatus[displayTab] } : order));
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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);

    const handleSearch = async () => {
        setLoading(true);
        setIsSearching(true);
        if (searchQuery.trim()) {
            try {
                const res = await apiGetOrderByCode(searchQuery.trim());
                if (res.success) {
                    const result = Array.isArray(res.data) ? res.data : [res.data];
                    setOrders(result);
                    const firstOrder = result[0];
                    if (firstOrder) {
                        const orderStatus = firstOrder.status;
                        if (SELL_TAB.some((tab) => tab.tab === orderStatus)) {
                            setDisplayTab(orderStatus);
                        } else {
                            setDisplayTab('');
                        }
                    }
                } else {
                    showNotification(res.message || 'Không tìm thấy đơn hàng', false);
                    setOrders([]);
                }
            } catch (err) {
                console.error('Lỗi tìm kiếm:', err);
                showNotification('Lỗi khi tìm kiếm đơn hàng', false);
            }
        } else {
            setIsSearching(false);
            const res = await apiGetAllOrders(displayTab);
            if (res.success) setOrders(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!isSearching && searchQuery === '') {
            const fetchOrders = async () => {
                const res = await apiGetAllOrders(displayTab);
                if (res.success) setOrders(res.data);
            };
            fetchOrders();
        }
    }, [searchQuery, isSearching, displayTab]);

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
                            onClick={() => setDisplayTab(e.tab)}
                        >
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
