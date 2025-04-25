import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatMoney } from '../../utils/formatMoney';
import { statusOrder } from '../../utils/statusOrder';
import { IOrder } from '../../interfaces/order.interfaces';
import { formatShippingDate } from '../../utils/format/formatShippingDate';
import ButtonOutline from '../buttonOutline';

interface OrderItemProps {
    order: IOrder;
    view?: boolean;
    handleCancelOrder: (orderId: string) => void;
    handleBuy: (orderId: string) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({ order, view = false, handleCancelOrder, handleBuy }) => {
    return (
        <div className="flex flex-col shrink-0 py-3 px-4 bg-white rounded-md overflow-hidden">
            {/* Thông tin trạng thái và ngày giao hàng */}
            <div className="flex flex-col gap-1">
                <div className="flex gap-1 items-center">
                    <AccessTimeIcon style={{ fontSize: '15px', color: 'rgb(0, 136, 72)' }} />
                    <p className="text-sm text-gray-600">
                        Ngày giao hàng dự kiến:
                        <span className="font-medium text-primary mx-1">{formatShippingDate(order?.order_date_shipping?.from || 0)}</span>
                        đến
                        <span className="font-medium text-primary mx-1">{formatShippingDate(order?.order_date_shipping?.to || 0)}</span>
                    </p>
                </div>
                <div className="flex gap-1 items-center">
                    {statusOrder(order)?.icon}
                    <p className="text-sm">{statusOrder(order)?.title}</p>
                </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="my-6">
                {order?.order_products?.map((product, index) => (
                    <div key={`${product.productId._id}-${index}`} className="flex w-full border-b border-solid border-bgSecondary py-3 px-4">
                        <div className="w-[70px] h-[70px] mr-3 p-1 border border-solid border-bgSecondary rounded-md overflow-hidden">
                            <img className="w-full h-full object-cover" src={product?.productId.product_thumb} alt={product?.productId?.product_name} />
                        </div>
                        <div className="flex-1 flex flex-col gap-1 truncate">
                            <h2 className="text-sm">{product?.productId?.product_name}</h2>
                            <p className="text-sm text-secondary">Giao đến: {order.order_shipping_address.detailAddress}</p>
                            <div className="flex gap-1 items-center text-sm text-secondary">
                                <CloseIcon style={{ fontSize: '12px', color: 'rgb(128, 128, 137)' }} />
                                <span>{product?.quantity}</span>
                            </div>
                        </div>
                        <div className="hidden tablet:flex justify-end flex-1 text-primary">{formatMoney(product?.price)}</div>
                    </div>
                ))}
            </div>

            {/* Tổng tiền và phí vận chuyển */}
            <div className="flex flex-col gap-2 w-full">
                {view && (
                    <div className="flex text-sm text-secondary justify-end">
                        Phí vận chuyển
                        <span className="text-end min-w-[100px]">{formatMoney(order?.order_shipping_price)}</span>
                    </div>
                )}
                <div className="flex text-xl text-secondary justify-end gap-1">
                    Tổng tiền:
                    <span className="text-end text-red_custom min-w-[100px]">{formatMoney(order?.order_total_price)}</span>
                </div>
            </div>

            {/* Nút hành động */}
            {!view && (
                <div className="flex justify-end mt-2 gap-2">
                    {order.order_status !== 'delivered' && (
                        <>
                            {order.order_status === 'cancelled' ? (
                                <ButtonOutline onClick={() => handleBuy(order?._id)}>Mua lại đơn hàng</ButtonOutline>
                            ) : (
                                order.order_status === 'pending' && <ButtonOutline onClick={() => handleCancelOrder(order?._id)}>Hủy đơn hàng</ButtonOutline>
                            )}
                        </>
                    )}
                    {/* TODO: Uncomment and implement navigation when needed */}
                    {/* <ButtonOutline onClick={() => navigate(`${path.PAGE_USER}/view/${order?._id}`)}>
            Xem chi tiết
          </ButtonOutline> */}
                </div>
            )}
        </div>
    );
};

export default OrderItem;
