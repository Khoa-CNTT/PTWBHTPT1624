/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IOrder } from '../../../interfaces/order.interfaces';
import { getOrder } from '../../../services/order.service';
import { statusOrder } from '../../../utils/statusOrder';
import { formatMoney } from '../../../utils/formatMoney';
import { OrderItem, SkeletonViewOrder } from '../../../components';
import { PATH } from '../../../utils/const';
import { formatShippingDate } from '../../../utils/format/formatShippingDate';

const OrderDetail: React.FC = () => {
    const param = useParams();
    const [order, setOrder] = useState<IOrder>();

    useEffect(() => {
        const fetchApiDetailOrder = async () => {
            const res = await getOrder(param?.oid);
            res.success && setOrder(res?.data);
        };
        fetchApiDetailOrder();
    }, [param.oid]);
    if (!order) return <SkeletonViewOrder />;
    return (
        <div className="w-full ">
            <div className="flex flex-col gap-1 w-full">
                <p className="text-xl text-secondary">
                    Chi tiết đơn hàng #<span className="uppercase text-primary">{order?.order_code}</span>
                </p>
                <p className="text-sm">
                    Trạng thái: <span className="text-primary">{statusOrder(order)?.title}</span>
                </p>
                <p className="text-sm">Ngày đặt hàng:{formatShippingDate(order?.createdAt)}</p>
            </div>
            <div className="w-full  grid grid-cols-3 mobile:grid-cols-1 my-6 gap-4">
                <div className="flex flex-col gap-2 w-full ">
                    <h2 className="text-sm uppercase text-secondary">Địa chỉ người nhận</h2>
                    <div className=" p-2 rounded-md bg-white min-h-[100px]">
                        <p className="text-base font-medium">{order?.order_shipping_address.fullName}</p>
                        <p className="text-sm text-secondary">
                            Địa chỉ:
                            <span className="font-normal text-primary mx-1">{order?.order_shipping_address?.detailAddress}</span>
                        </p>
                        <p className="text-sm text-secondary">
                            Điện thoại:
                            <span className="font-normal text-primary mx-1">{order?.order_shipping_address.phone}</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 ">
                    <h2 className="text-sm uppercase text-secondary">Hình thức giao hàng</h2>
                    <div className="p-4 rounded-md bg-white min-h-[100px] shadow-md space-y-2">
                        <p className="text-sm text-gray-600">
                            Công ty vận chuyển:
                            <span className="font-normal text-primary">{formatShippingDate(order?.order_date_shipping)}</span> đến
                        </p>
                        <p className="text-sm text-gray-600">
                            Phí vận chuyển: <span className="font-semibold text-red-500">{formatMoney(Number(order?.order_total_price))}</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h2 className="text-sm uppercase text-secondary">Hình thức thanh toán</h2>
                    <div className=" p-2 rounded-md bg-white min-h-[100px]">
                        <p className="text-sm text-secondary">{order.order_payment_method}</p>
                    </div>
                </div>
            </div>

            {order && <OrderItem order={order} view />}

            <div className="my-3">
                <Link className="text-sm text-primary" to={`${PATH.MANAGE_ORDER}`}>
                    {'<< Quay lại danh sách đơn hàng'}
                </Link>
            </div>
        </div>
    );
};

export default OrderDetail;
