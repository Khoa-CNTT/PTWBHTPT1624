import React from 'react';
import { formatMoney } from '../../utils/formatMoney';
import { logo } from '../../assets';
import useAdminStore from '../../store/adminStore';
import { IProductInCart } from '../../interfaces/cart.interfaces';

// Định nghĩa interface cho props của ReceiptContent
interface ReceiptContentProps {
    cart: IProductInCart[];
    paymentMethod: string;
    cashReceived: number | '';
    calculateSubtotal: number;
    calculateDiscountFromProducts: number;
    calculateTotal: number;
    calculateChange: number;
    appliedDiscount: number;
}

// Component hiển thị nội dung hóa đơn
export const ReceiptContent: React.FC<ReceiptContentProps> = ({
    cart,
    paymentMethod,
    cashReceived,
    calculateSubtotal,
    calculateDiscountFromProducts,
    calculateTotal,
    calculateChange,
    appliedDiscount,
}) => {
    const { admin } = useAdminStore();

    // Thông tin QR chuyển khoản Agribank theo chuẩn VietQR (NAPAS)
    const account = import.meta.env.VITE_REACT_ACCOUNT_PAYMENT;
    const content = `Thanh toan don hang ${formatMoney(calculateTotal)} vnd`;
    const bankCode = import.meta.env.VITE_REACT_ARB_BANK_CODE; // Mã Napas của Agribank
    const qrUrl = `https://img.vietqr.io/image/${bankCode}-${account}-compact.png?amount=${calculateTotal}&addInfo=${encodeURIComponent(content)}`;

    // Hàm render thông tin thanh toán
    const renderPaymentInfo = () => (
        <div className="mb-4 space-y-1">
            <p>
                <span className="font-medium">Thanh toán:</span> {paymentMethod === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản'}
            </p>
            <p>
                <span className="font-medium">Voucher đã áp dụng:</span> {appliedDiscount ? 'Đã áp dụng' : 'Không sử dụng'}
            </p>
        </div>
    );

    // Hàm render danh sách sản phẩm
    const renderProductList = () => (
        <table className="w-full border mt-2 mb-4 text-left">
            <thead className="bg-gray-100">
                <tr>
                    <th className="border px-2 py-1">Tên sản phẩm</th>
                    <th className="border px-2 py-1">Giá gốc</th>
                    <th className="border px-2 py-1">Số lượng</th>
                    <th className="border px-2 py-1">Giảm giá</th>
                    <th className="border px-2 py-1">Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                {cart.map((item) => (
                    <tr key={item.productId}>
                        <td className="border px-2 py-1">{item.product_name || 'Không tên'}</td>
                        <td className="border px-2 py-1">{formatMoney(item.product_price)}</td>
                        <td className="border px-2 py-1">{item.quantity}</td>
                        <td className="border px-2 py-1">{item.product_discount}%</td>
                        <td className="border px-2 py-1">{formatMoney(item.product_discounted_price * item.quantity)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    // Hàm render thông tin tổng tiền và QR chuyển khoản
    const renderSummaryAndQR = () => (
        <div className="flex justify-between">
            <div className="space-y-1 mb-4">
                <p>
                    <span className="font-medium">Giảm giá:</span> -{formatMoney(calculateDiscountFromProducts)}
                </p>
                {appliedDiscount > 0 && (
                    <p>
                        <span className="font-medium">Voucher:</span> -{formatMoney(appliedDiscount)}
                    </p>
                )}
                <p>
                    <span className="font-medium">Thành tiền:</span> {formatMoney(calculateSubtotal - (calculateDiscountFromProducts + appliedDiscount))}
                </p>
                <p>
                    <span className="font-medium">Phương thức mua hàng:</span> {paymentMethod === 'CASH' ? 'Trực tiếp' : 'Chuyển khoản'}
                </p>
                {paymentMethod === 'CASH' && (
                    <>
                        <p>
                            <span className="font-medium">Tiền nhận:</span> {formatMoney(Number(cashReceived))}
                        </p>
                        <p>
                            <span className="font-medium">Số dư trả lại:</span> {formatMoney(calculateChange)}
                        </p>
                    </>
                )}
            </div>
            {paymentMethod !== 'CASH' && <img src={qrUrl} alt="QR chuyển khoản Agribank" className="w-60 mx-auto" />}
        </div>
    );

    return (
        <div className="receipt-content max-w-[700px] mx-auto bg-white p-6 rounded-md shadow-md text-sm text-gray-800">
            {/* Header hóa đơn */}
            <div className="text-center border-b pb-4 mb-4">
                <img src={logo} alt="logo" className="w-20 mx-auto mb-2" />
                <h2 className="text-2xl font-bold uppercase text-green-700">Bánh hóa xanh</h2>
                <p>Địa chỉ: Ngũ Hành Sơn, Đà Nẵng</p>
                <p>Nhân viên: {admin?.admin_name}</p>
                <p>SĐT: {admin?.admin_mobile}</p>
                <p>Thời gian: {new Date().toLocaleString()}</p>
            </div>

            <h3 className="text-center text-lg font-semibold mb-4 uppercase">Hóa đơn mua hàng</h3>

            {/* Thông tin thanh toán */}
            <div className="mb-4 px-2">{renderPaymentInfo()}</div>

            {/* Danh sách sản phẩm */}
            <div className="overflow-x-auto">{renderProductList()}</div>

            {/* Tổng tiền và QR */}
            <div className="mt-6 p-4 bg-gray-50 rounded-md border">{renderSummaryAndQR()}</div>

            {/* Footer */}
            <p className="text-center text-xs text-gray-500 mt-6 italic">Cảm ơn quý khách đã mua hàng!</p>
        </div>
    );
};
