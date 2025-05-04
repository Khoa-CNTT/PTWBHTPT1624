/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import DeliveryAddress from '../../../components/deliveryAddress';
import ProductInCartItem from '../../../components/item/ProductInCartItem';
import SelectVoucher from './SelectVoucher';
import { useCartStore } from '../../../store/cartStore';
import { PATH, PAYMENT_METHOD } from '../../../utils/const';
import { apiGetAllShippingCompanies } from '../../../services/shippingCompany.service';
import { IShipping } from '../../../interfaces/shipping.interfaces';
import { IVoucher } from '../../../interfaces/voucher.interfaces';
import { formatMoney } from '../../../utils/formatMoney';
import { showNotification } from '../../../components/common/showNotification';
import { apiCreateOrders } from '../../../services/order.service';
import useUserStore from '../../../store/userStore';
import { INotification } from '../../../interfaces/notification.interfaces';
import { sendNotificationToAdmin } from '../../../services/notification.service';
import { useActionStore } from '../../../store/actionStore';
import { ENV } from '../../../config/ENV';
import { sortObject } from '../../../utils/sortObject';
import { calculateVnpSecureHash } from '../../../utils/calculateVnpSecureHash';
import { useOrderStore } from '../../../store/orderStore';

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

    // Calculate total product price
    const totalProductPrice = selectedProducts.reduce((total, product) => total + product.product_discounted_price * (product.quantity || 1), 0);

    // Get selected shipping fee
    const selectedShipping = shippings.find((s) => s._id === methods.deliveryMethod);
    const shippingFee = selectedShipping?.sc_shipping_price || 0;

    // Calculate voucher discount
    const voucherDiscount = selectedVoucher
        ? selectedVoucher.voucher_method === 'percent'
            ? Math.min((totalProductPrice * selectedVoucher.voucher_value) / 100, selectedVoucher.voucher_max_price || Infinity)
            : selectedVoucher.voucher_value
        : 0;

    // Calculate final total
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
    }, []);

    // Handle payment method selection
    const handlePaymentSelect = (code: string) => {
        setMethods((prev) => ({ ...prev, paymentMethod: code }));
    };

    // Handle order placement
    const handlePlaceOrder = async () => {
        if (!methods.paymentMethod) {
            showNotification('Vui lòng chọn phương thức thanh toán', false);
            return;
        }
        if (!methods.deliveryMethod) {
            showNotification('Vui lòng chọn phương thức giao hàng', false);
            return;
        }
        const data: any = {
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
        };
        if (methods.paymentMethod === 'CASH') {
            if (selectedVoucher?._id) {
                data.order_voucherId = selectedVoucher?._id;
            }
            setIsLoading(true);
            const res = await apiCreateOrders(data);
            setIsLoading(false);
            // Placeholder for order submission API call
            showNotification(res.message, res.success);
            if (!res.success) return;
            const notification: INotification = {
                notification_title: '🛒 Đơn hàng mới vừa được tạo!',
                notification_subtitle: '📦 Một khách hàng vừa đặt hàng. ✅ Kiểm tra và xử lý ngay để đảm bảo giao hàng đúng hẹn!',
                notification_imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuxPDt8O4FtLGH2odJdU8Udg6KJpdvQ1fGMw&s',
                notification_link: '/quan-ly/don-hang',
            };

            await sendNotificationToAdmin(notification);
            selectedProducts.forEach((e) => {
                setRemoveProductInCart(e.productId);
            });
            navigate(PATH.PAGE_ORDER);
        } else {
            setOrder(data);
        }
    };
    const handleVNPayPayment = () => {
        handlePlaceOrder();
        const vnp_TmnCode = ENV.vnp_TmnCode;
        const vnp_HashSecret = ENV.vnp_HashSecret;
        const vnp_Url = ENV.vnp_Url;
        const returnUrl = `${ENV.BASE_URL}${PATH.PAGE_PAYMENT_CONFIRM}`;
        console.log({vnp_HashSecret,vnp_Url,vnp_TmnCode,returnUrl})
        if (!vnp_HashSecret || !vnp_Url || !vnp_TmnCode || !returnUrl) {
            alert('Không thể thực hiện thanh toán, thiếu thông tin cấu hình.');
            return;
        }
        // Lấy ngày giờ hiện tại
        const createDate = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
        const orderId =
            new Date().getHours().toString().padStart(2, '0') + new Date().getMinutes().toString().padStart(2, '0') + Math.floor(Math.random() * 10000); // Mã giao dịch duy nhất
        // Dữ liệu thanh toán
        const paymentData: any = {
            vnp_Amount: totalPayment * 100, // Chuyển đổi sang đơn vị VNPay
            vnp_Command: 'pay',
            vnp_CreateDate: createDate,
            vnp_CurrCode: 'VND',
            vnp_IpAddr: '127.0.0.1', // Địa chỉ IP của người dùng
            vnp_Locale: 'vn', // Ngôn ngữ mặc định
            vnp_OrderInfo: `p`,
            vnp_OrderType: '250000',
            vnp_ReturnUrl: returnUrl,
            vnp_TxnRef: orderId, // Mã tham chiếu giao dịch
            vnp_Version: '2.1.0',
            vnp_TmnCode: vnp_TmnCode,
        };
        // Sắp xếp các tham số theo thứ tự alphabet
        const sortedParams: any = sortObject(paymentData)
            .map((key) => `${key}=${encodeURIComponent(paymentData[key])}`)
            .join('&');
        // Tạo HMAC SHA512
        const vnp_SecureHash = calculateVnpSecureHash(sortedParams, vnp_HashSecret);
        // Tạo URL thanh toán
        const paymentUrl = `${vnp_Url}?${sortedParams}&vnp_SecureHash=${vnp_SecureHash}`;
        console.log('paymentUrl', paymentUrl);
        // Điều hướng người dùng đến VNPay
        alert(`Thanh toán qua VNPay với số tiền: ${totalPayment} VND`);

        window.location.href = paymentUrl;
    };
    // Render delivery method selection
    const renderDeliveryMethods = () => (
        <div className="mb-8 w-full ">
            <label htmlFor="delivery-method-select" className="block mb-2 text-gray-900 font-medium">
                Chọn hình thức giao hàng
            </label>
            <select
                id="delivery-method-select"
                value={methods.deliveryMethod}
                onChange={(e) => setMethods((prev) => ({ ...prev, deliveryMethod: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                {shippings.map((shipping) => (
                    <option key={shipping._id} value={shipping._id}>
                        {shipping.sc_name} - {formatMoney(shipping.sc_shipping_price)}
                    </option>
                ))}
            </select>
        </div>
    );

    // Render product list
    const renderProductList = () => (
        <div className="mb-8 rounded-lg border border-gray-200 p-4">
            <div className="grid grid-cols-5 mb-4 font-medium text-sm text-gray-800">
                <span className="col-span-2">Sản phẩm</span>
                <span className="text-center">Đơn giá</span>
                <span className="text-center">Số lượng</span>
                <span className="text-center">Thành tiền</span>
            </div>
            {selectedProducts.map((product) => (
                <ProductInCartItem key={product.productId} product={product} isSelector={false} />
            ))}
        </div>
    );

    // Render voucher selection
    const renderVoucherSelection = () => (
        <div className="mb-8">
            <SelectVoucher setSelectedVoucher={setSelectedVoucher} />
            {selectedVoucher && (
                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md hover:shadow-md transition">
                    <div className="flex items-start gap-4">
                        <div className="border-l-4 border-green-500 pl-3">
                            <img src={selectedVoucher.voucher_thumb} alt="Voucher" className="w-20 h-20 object-cover rounded" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-base font-semibold">
                                {selectedVoucher.voucher_name}
                                <span className="block text-sm text-red-500">Đơn tối thiểu {formatMoney(selectedVoucher.voucher_min_order_value)}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                                {selectedVoucher.voucher_method === 'fixed'
                                    ? `Giảm giá ${formatMoney(selectedVoucher.voucher_value)}`
                                    : `Giảm giá tối đa ${formatMoney(selectedVoucher.voucher_max_price)}`}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setSelectedVoucher(null)} className="text-red-500 hover:underline">
                        Xóa
                    </button>
                </div>
            )}
        </div>
    );

    // Render payment method selection
    const renderPaymentMethods = () => (
        <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">{PAYMENT_METHOD.title}</h2>
            <div className="w-full  rounded-md p-4">
                {PAYMENT_METHOD.method.map((method) => (
                    <label key={method.code} className="flex cursor-pointer items-center gap-3 py-2" onClick={() => handlePaymentSelect(method.code)}>
                        <input
                            type="radio"
                            className="h-4 w-4 text-blue-600"
                            checked={methods.paymentMethod === method.code}
                            onChange={() => handlePaymentSelect(method.code)}
                        />
                        <img src={method.img} alt={method.code} className={method.code === 'VNPAY' ? 'w-20' : 'h-8 w-8'} />
                        {method.code !== 'VNPAY' && <span className="text-sm text-gray-700">{method.label || method.code}</span>}
                    </label>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 gap-2">
            <Header />
            <div className="flex flex-col gap-4 py-2">
                <DeliveryAddress />
                <div className="w-full rounded-lg bg-white p-6 shadow-sm">
                    {renderProductList()}
                    {renderDeliveryMethods()}
                    {renderVoucherSelection()}
                    {renderPaymentMethods()}
                    <div className="w-full mx-auto bg-white border rounded-md shadow-sm text-sm">
                        <div className="px-4 py-4 border-b">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-800 font-medium">Phương thức thanh toán</span>
                            </div>
                            <span className="text-gray-800">{PAYMENT_METHOD.method.find((m) => m.code === methods.paymentMethod)?.label || 'Chưa chọn'}</span>
                        </div>
                        <div className="px-4 py-4 bg-[#fefdf9] border-b">
                            <div className="flex justify-between mb-2">
                                <span>Tổng tiền hàng</span>
                                <span className="text-gray-800">{formatMoney(totalProductPrice)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span>Tổng tiền phí vận chuyển</span>
                                <span className="text-gray-800">{formatMoney(shippingFee)}</span>
                            </div>
                            {selectedVoucher && (
                                <div className="flex justify-between mb-2">
                                    <span>Giảm giá voucher</span>
                                    <span className="text-gray-800">-{formatMoney(voucherDiscount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-semibold text-lg text-red-600">
                                <span>Tổng thanh toán</span>
                                <span>{formatMoney(totalPayment)}</span>
                            </div>
                        </div>
                        <div className="flex justify-end p-4">
                            <button
                                onClick={() => {
                                    if (methods.paymentMethod === 'CASH') {
                                        handlePlaceOrder();
                                    } else {
                                        handleVNPayPayment();
                                    }
                                }}
                                className="bg-[#ee4d2d] text-white px-6 py-2 rounded hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                disabled={!methods.paymentMethod || !methods.deliveryMethod}>
                                Đặt hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
