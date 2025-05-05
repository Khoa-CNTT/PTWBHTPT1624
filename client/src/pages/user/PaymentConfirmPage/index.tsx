/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { sortObject } from '../../../utils/sortObject';
import { calculateVnpSecureHash } from '../../../utils/calculateVnpSecureHash';
import { ENV } from '../../../config/ENV';
import { PATH } from '../../../utils/const';
import { useOrderStore } from '../../../store/orderStore';
import { apiCreateOrders } from '../../../services/order.service';
import { useActionStore } from '../../../store/actionStore';
import { INotification } from '../../../interfaces/notification.interfaces';
import { sendNotificationToAdmin } from '../../../services/notification.service';
import { useCartStore } from '../../../store/cartStore';
import { showNotification } from '../../../components';
import useSocketStore from '../../../store/socketStore';

// Định nghĩa kiểu cho các tham số query
interface VnpParams {
    [key: string]: string | undefined;
}

const PaymentConfirmPage: React.FC = () => {
    const location = useLocation();
    const { order, clearOrder } = useOrderStore();
    const { setIsLoading } = useActionStore();
    const queries = queryString.parse(location.search) as VnpParams;
    const vnp_HashSecret = ENV.vnp_HashSecret || '';
    const navigate = useNavigate();
    const { selectedProducts, setRemoveProductInCart } = useCartStore();
    const { socket, isConnected, connect } = useSocketStore();

    useEffect(() => {
        if (!isConnected) connect();
    }, [isConnected, connect]);
    const verifyPayment = async () => {
        const { vnp_SecureHash, ...vnp_Params } = queries;
        const sortedParams = sortObject(vnp_Params)
            .map((key: string) => `${key}=${encodeURIComponent(vnp_Params[key] as string)}`)
            .join('&');
        const signed = calculateVnpSecureHash(sortedParams, vnp_HashSecret);
        console.log('order', order);
        if (vnp_SecureHash === signed) {
            const { vnp_TransactionStatus } = vnp_Params;
            if (vnp_TransactionStatus === '00') {
                setIsLoading(true);
                const res = await apiCreateOrders(order);
                setIsLoading(false);
                showNotification(res.message, res.success);
                if (!res.success) {
                    navigate(PATH.PAGE_PAYMENT);
                    return;
                }
                clearOrder();
                const notification: INotification = {
                    notification_title: '🛒 Đơn hàng mới vừa được tạo!',
                    notification_subtitle: '📦 Một khách hàng vừa đặt hàng. ✅ Kiểm tra và xử lý ngay để đảm bảo giao hàng đúng hẹn!',
                    notification_imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuxPDt8O4FtLGH2odJdU8Udg6KJpdvQ1fGMw&s',
                    notification_link: '/quan-ly/don-hang',
                };
                const response = await sendNotificationToAdmin(notification);
                socket.emit('sendMessageForAdminOnline', {
                    ...response.data,
                });
                await Promise.all(selectedProducts.map((e) => setRemoveProductInCart(e.productId)));
                navigate(PATH.PAGE_ORDER);
            } else {
                showNotification('Thanh toán không thành công', false);
                // navigate(PATH.PAGE_PAYMENT);
            }
        } else {
            showNotification('Xác thực thanh toán thất bại', false);
            // navigate(PATH.PAGE_PAYMENT);
        }
    };

    useEffect(() => {
        if (queries.vnp_SecureHash) {
            verifyPayment();
        }
    }, []);

    return (
        <div className="flex mobile:flex-col w-full h-screen bg-white p-5">
            <div className="flex mobile:w-full w-6/12 mx-auto justify-center items-center ">
                <div className="w-[400px]">
                    <video className="object-cover" src="https://cdnl.iconscout.com/lottie/premium/thumb/payment-received-8453779-6725893.mp4" autoPlay loop />
                </div>
            </div>
        </div>
    );
};

export default PaymentConfirmPage;
