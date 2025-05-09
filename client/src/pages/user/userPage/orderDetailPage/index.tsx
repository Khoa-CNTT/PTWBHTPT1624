import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IOrder } from '../../../../interfaces/order.interfaces';
import { getOrder } from '../../../../services/order.service';
import { statusOrder } from '../../../../utils/statusOrder';
import { formatMoney } from '../../../../utils/formatMoney';
import { OrderItem, SkeletonViewOrder } from '../../../../components';
import { PATH } from '../../../../utils/const';
import { formatShippingDate } from '../../../../utils/format/formatShippingDate';

const OrderDetailPage: React.FC = () => {
    const param = useParams();
    const [order, setOrder] = useState<IOrder>();

    useEffect(() => {
        const fetchApiDetailOrder = async () => {
            const res = await getOrder(param?.oid);
            if (res.success) setOrder(res?.data);
        };
        fetchApiDetailOrder();
    }, [param.oid]);

    if (!order) return <SkeletonViewOrder />;

    return (
        <div className="w-full p-4 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-secondary">
                    Chi tiết đơn hàng <span className="uppercase text-primary">#{order.order_code}</span>
                </h1>
                <p className="text-sm mt-1">
                    Trạng thái: <span className="text-primary font-medium">{statusOrder(order)?.title}</span>
                </p>
                <p className="text-sm text-gray-600">Ngày đặt hàng: {formatShippingDate(order.createdAt)}</p>
            </div>

            {/* Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Địa chỉ người nhận */}
                <div className="bg-white shadow rounded-xl p-4">
                    <h2 className="text-sm font-semibold text-secondary mb-2 uppercase">Địa chỉ người nhận</h2>
                    <p className="text-base font-medium">{order.order_shipping_address.fullName}</p>
                    <p className="text-sm text-gray-600 mt-1">
                        Địa chỉ: <span className="text-primary">{order.order_shipping_address.detailAddress}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                        Điện thoại: <span className="text-primary">{order.order_shipping_address.phone}</span>
                    </p>
                </div>

                {/* Hình thức giao hàng */}
                <div className="bg-white shadow rounded-xl p-4">
                    <h2 className="text-sm font-semibold text-secondary mb-2 uppercase">Hình thức giao hàng</h2>
                    <p className="text-sm text-gray-600">
                        Giao hàng từ: <span className="text-primary">{formatShippingDate(order.order_date_shipping.from)}</span> đến{' '}
                        <span className="text-primary">{formatShippingDate(order.order_date_shipping.to)}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        Phí vận chuyển: <span className="text-red-500 font-semibold">{formatMoney(Number(order.order_shipping_price))}</span>
                    </p>
                </div>

                {/* Hình thức thanh toán */}
                <div className="bg-white shadow rounded-xl p-4">
                    <h2 className="text-sm font-semibold text-secondary mb-2 uppercase">Hình thức thanh toán</h2>
                    <p className="text-sm text-gray-600">{order.order_payment_method}</p>
                </div>
            </div>

            {/* Sản phẩm */}
            <div className="mt-8">
                <OrderItem order={order} view />
            </div>

            {/* Back link */}
            <div className="mt-6">
                <Link className="text-sm text-primary hover:underline flex items-center gap-1" to={PATH.PAGE_ORDER}>
                    <span>&laquo;</span> Quay lại danh sách đơn hàng
                </Link>
            </div>
        </div>
    );
};

export default OrderDetailPage;
