/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import DeliveryAddress from '../../../components/deliveryAddress';
import { useCartStore } from '../../../store/cartStore';
import { useActionStore } from '../../../store/actionStore';
import { useOrderStore } from '../../../store/orderStore';
import { PATH } from '../../../utils/const';
import { sendNotificationToAdmin } from '../../../services/notification.service';
import { showNotification } from '../../../components/common/showNotification';
import { ENV } from '../../../config/ENV';
import ProductList from './ProductList';
import useUserStore from '../../../store/userStore';
import { IShipping } from '../../../interfaces/shipping.interfaces';
import { IVoucher } from '../../../interfaces/voucher.interfaces';
import { apiCreateOrders } from '../../../services/order.service';
import { INotification } from '../../../interfaces/notification.interfaces';
import { sortObject } from '../../../utils/sortObject';
import { calculateVnpSecureHash } from '../../../utils/calculateVnpSecureHash';
import { apiGetAllShippingCompanies } from '../../../services/shippingCompany.service';
import DeliveryMethods from './DeliveryMethods';
import VoucherSelection from './VoucherSelection';
import PaymentMethods from './PaymentMethods';
import OrderSummary from './OrderSummary';

const PaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const { selectedProducts, setRemoveProductInCart } = useCartStore();
    const { user } = useUserStore();
    const { setIsLoading } = useActionStore();
    const { setOrder } = useOrderStore();
    const [shippings, setShippings] = useState<IShipping[]>([]);
    const [selectedVoucher, setSelectedVoucher] = useState<IVoucher | null>(null);
    const [methods, setMethods] = useState({
        deliveryMethod: '',
        paymentMethod: 'CASH',
    });

    // Calculations
    const totalProductPrice = selectedProducts.reduce((total, product) => total + product.product_discounted_price * (product.quantity || 1), 0);
    const selectedShipping = shippings.find((s) => s._id === methods.deliveryMethod);
    const shippingFee = selectedShipping?.sc_shipping_price || 0;
    const voucherDiscount = selectedVoucher
        ? selectedVoucher.voucher_method === 'percent'
            ? Math.min((totalProductPrice * selectedVoucher.voucher_value) / 100, selectedVoucher.voucher_max_price || Infinity)
            : selectedVoucher.voucher_value
        : 0;
    const totalPayment = totalProductPrice + shippingFee - voucherDiscount;

    // Fetch shipping methods
    useEffect(() => {
        const fetchShippingCompanies = async () => {
            const res = await apiGetAllShippingCompanies();
            if (res.success && res.data.length > 0) {
                setShippings(res.data);
                setMethods((prev) => ({ ...prev, deliveryMethod: res.data[0]._id }));
            } else {
                showNotification('Không tìm thấy phương thức giao hàng', false);
            }
        };
        fetchShippingCompanies();
    }, []);

    // Redirect to cart if no products
    useEffect(() => {
        if (selectedProducts.length === 0) {
            navigate(PATH.HOME);
        }
    }, [selectedProducts, navigate]);

    // Handlers
    const handleMethodChange = (key: 'deliveryMethod' | 'paymentMethod', value: string) => {
        setMethods((prev) => ({ ...prev, [key]: value }));
    };

    const createOrderData = () => ({
        order_shipping_company: selectedShipping?._id,
        order_shipping_address: {
            fullName: user?.user_name,
            detailAddress: user?.user_address?.detail,
            village: user?.user_address?.village,
            district: user?.user_address?.district,
            city: user?.user_address?.city,
            phone: user?.user_mobile,
        },
        order_payment_method: methods.paymentMethod,
        order_products: selectedProducts.map((p) => ({ productId: p.productId, quantity: p.quantity })),
        ...(selectedVoucher?._id && { order_voucherId: selectedVoucher._id }),
    });

    const handlePlaceOrder = async () => {
        if (!methods.paymentMethod || !methods.deliveryMethod) {
            showNotification('Vui lòng chọn phương thức thanh toán và giao hàng', false);
            return;
        }
        const data = createOrderData();
        if (methods.paymentMethod === 'CASH') {
            setIsLoading(true);
            const res = await apiCreateOrders(data);
            setIsLoading(false);
            showNotification(res.message, res.success);
            if (!res.success) return;
            const notification: INotification = {
                notification_title: '🛒 Đơn hàng mới vừa được tạo!',
                notification_subtitle: '📦 Một khách hàng vừa đặt hàng. ✅ Kiểm tra và xử lý ngay để đảm bảo giao hàng đúng hẹn!',
                notification_imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuxPDt8O4FtLGH2odJdU8Udg6KJpdvQ1fGMw&s',
                notification_link: '/quan-ly/don-hang',
            };
            await sendNotificationToAdmin(notification);
            await Promise.all(selectedProducts.map((e) => setRemoveProductInCart(e.productId)));
            navigate(PATH.PAGE_ORDER);
        } else {
            setOrder(data);
            handleVNPayPayment();
        }
    };

    const handleVNPayPayment = () => {
        const { vnp_TmnCode, vnp_HashSecret, vnp_Url, BASE_URL } = ENV;
        const returnUrl = `${BASE_URL}${PATH.PAGE_PAYMENT_CONFIRM}`;
        if (!vnp_HashSecret || !vnp_Url || !vnp_TmnCode || !returnUrl) {
            alert('Không thể thực hiện thanh toán, thiếu thông tin cấu hình.');
            return;
        }
        const createDate = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
        const orderId =
            new Date().getHours().toString().padStart(2, '0') + new Date().getMinutes().toString().padStart(2, '0') + Math.floor(Math.random() * 10000);
        const paymentData: any = {
            vnp_Amount: totalPayment * 100,
            vnp_Command: 'pay',
            vnp_CreateDate: createDate,
            vnp_CurrCode: 'VND',
            vnp_IpAddr: '127.0.0.1',
            vnp_Locale: 'vn',
            vnp_OrderInfo: `p`,
            vnp_OrderType: '250000',
            vnp_ReturnUrl: returnUrl,
            vnp_TxnRef: orderId,
            vnp_Version: '2.1.0',
            vnp_TmnCode: vnp_TmnCode,
        };
        const sortedParams: any = sortObject(paymentData)
            .map((key) => `${key}=${encodeURIComponent(paymentData[key])}`)
            .join('&');
        const vnp_SecureHash = calculateVnpSecureHash(sortedParams, vnp_HashSecret);
        const paymentUrl = `${vnp_Url}?${sortedParams}&vnp_SecureHash=${vnp_SecureHash}`;
        alert(`Thanh toán qua VNPay với số tiền: ${totalPayment} VND`);
        window.location.href = paymentUrl;
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 gap-4 mt-2">
            <Header />
            <div className="flex flex-col rounded-sm overflow-hidden">
                <div className="airmail-border "></div>
                <div className="w-full   bg-white p-6 shadow-sm">
                    <DeliveryAddress />
                    <ProductList products={selectedProducts} />
                    <DeliveryMethods
                        shippings={shippings}
                        selectedMethod={methods.deliveryMethod}
                        onMethodChange={(value: string) => handleMethodChange('deliveryMethod', value)}
                    />
                    <VoucherSelection selectedVoucher={selectedVoucher} setSelectedVoucher={setSelectedVoucher} />
                    <PaymentMethods
                        totalPayment={totalPayment}
                        selectedMethod={methods.paymentMethod}
                        onMethodChange={(value: string) => handleMethodChange('paymentMethod', value)}
                    />
                    <OrderSummary
                        totalProductPrice={totalProductPrice}
                        shippingFee={shippingFee}
                        voucherDiscount={voucherDiscount}
                        totalPayment={totalPayment}
                        selectedPaymentMethod={methods.paymentMethod}
                        deliveryMethod={methods.deliveryMethod}
                        paymentMethod={methods.paymentMethod}
                        onPlaceOrder={() => (methods.paymentMethod === 'CASH' ? handlePlaceOrder() : handleVNPayPayment())}
                    />
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
