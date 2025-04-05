import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatMoney } from '../../utils/formatMoney';
import { statusOrder } from '../../utils/statusOrder';
import { IOrder } from '../../interfaces/order.interfaces';
import { formatShippingDate } from '../../utils/format/formatShippingDate';
const OrderItem: React.FC<{ order: IOrder; view?: boolean }> = ({ order, view }) => {
    return (
        <div className="flex flex-col shrink-0 py-3 px-4 bg-white rounded-md overflow-hidden">
            <div className="flex flex-col gap-1">
                <div className="flex gap-1 items-center">
                    <AccessTimeIcon style={{ fontSize: '15px', color: 'rgb(0 136 72)' }} />
                    <p className="text-primary text-sm font-medium">
                        <p className="text-sm text-gray-600">
                            Ngày giao hàng dự kiến:
                            <span className="font-medium text-primary mx-1">{formatShippingDate(order?.order_date_shipping.from)}</span>đến
                            <span className="font-medium text-primary mx-1">{formatShippingDate(order?.order_date_shipping.to)}</span>
                        </p>
                    </p>
                </div>
                <div className="flex gap-1 items-center">
                    {statusOrder(order)?.icon}
                    <p className="text-sm ">{statusOrder(order)?.title}</p>
                </div>
            </div>
            <div className="my-6">
                {order?.order_products.map((p) => (
                    <div className="flex w-full h-auto border-solid  border-b-[1px] border-separate py-3 px-4">
                        <div className="w-[70px] h-[70px] mr-3 p-1 border-solid border-[1px] border-bgSecondary rounded-md overflow-hidden">
                            <img className="w-full h-full object-cover" src={p?.product_thumb} alt={p?.productId?.product_name} />
                        </div>
                        <div className="tablet:w-auto w-2/3 flex flex-col gap-1 truncate">
                            <h2 className="text-sm">{p?.productId?.product_name}</h2>
                            <div className="flex gap-1 items-center">
                                <p className="text-sm text-secondary">Giao đến: {order.order_shipping_address.detailAddress}</p>
                            </div>
                            <div className="flex gap-1 items-center text-sm text-secondary">
                                <CloseIcon style={{ fontSize: '12px', color: 'rgb(128 128 137)' }} />
                                {p?.quantity}
                            </div>
                        </div>
                        <div className="tablet:hidden flex justify-end flex-1 text-primary">{formatMoney(p?.price)}</div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-2 w-full h-full">
                {view && (
                    <div className="flex text-sm text-secondary w-full h-full justify-end">
                        Phí vận chuyển
                        <span className="text-end text-secondary min-w-[100px]">{formatMoney(order?.order_shipping_price)}</span>
                    </div>
                )}
                <div className="flex text-xl text-secondary w-full h-full justify-end gap-1">
                    Tổng tiền:
                    <span className="text-end text-red_custom min-w-[100px] ">{formatMoney(order?.order_total_price)}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderItem;
