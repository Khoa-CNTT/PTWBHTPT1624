import React from 'react';
import { IProductInCart } from '../../interfaces/product.interfaces';
import { formatMoney } from '../../utils/formatMoney';
import { logo } from '../../assets';
import useAdminStore from '../../store/adminStore';

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
    // Tính tổng giảm giá
    const totalDiscount = calculateDiscountFromProducts + (calculateSubtotal - calculateDiscountFromProducts) * (appliedDiscount / 100);
    const { admin } = useAdminStore();

    // Thông tin QR chuyển khoản Agribank theo chuẩn VietQR (NAPAS)
    const account = import.meta.env.VITE_REACT_ACCOUNT_PAYMENT;
    const content = 'Thanh toan don hang ABC123';
    const bankCode = import.meta.env.VITE_REACT_ARB_BANK_CODE; // Mã Napas của Agribank
    const qrUrl = `https://img.vietqr.io/image/${bankCode}-${account}-compact.png?amount=${calculateTotal}&addInfo=${encodeURIComponent(content)}`;

    // Hàm render thông tin thanh toán
    const renderPaymentInfo = () => (
        <div className="mb-4 space-y-1">
            <p>
                <span className="font-medium">Thanh toán:</span> {paymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}
            </p>
            <p>
                <span className="font-medium">Voucher đã áp dụng:</span> Không sử dụng
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
                    <th className="border px-2 py-1">Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                {cart.map((item) => (
                    <tr key={item.productId}>
                        <td className="border px-2 py-1">{item.name || 'Không tên'}</td>
                        <td className="border px-2 py-1">{formatMoney(item.price)}</td>
                        <td className="border px-2 py-1">{item.quantity}</td>
                        <td className="border px-2 py-1">{formatMoney(item.price * item.quantity * (1 - item.discount / 100))}</td>
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
                    <span className="font-medium">Giảm giá:</span> {formatMoney(totalDiscount)}
                </p>
                <p>
                    <span className="font-medium">Thành tiền:</span> {formatMoney(calculateTotal)}
                </p>
                <p>
                    <span className="font-medium">Phương thức mua hàng:</span> {paymentMethod === 'cash' ? 'Trực tiếp' : 'Chuyển khoản'}
                </p>
                {paymentMethod === 'cash' && (
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
            {paymentMethod !== 'cash' && <img src={qrUrl} alt="QR chuyển khoản Agribank" className="w-60 mx-auto" />}
        </div>
    );

    return (
        <div className="receipt-content">
            {/* Header hóa đơn */}
            <div className="text-center mb-4">
                <img src={logo} alt="logo" className="w-16 mx-auto mb-2" />
                <h2 className="text-xl font-bold uppercase">Bánh hóa xanh</h2>
                <p>Địa chỉ: Ngũ Hành Sơn, Đà Nẵng</p>
                <p>Nhân viên: {admin?.admin_name}</p>
                <p>Số điện thoại: {admin?.admin_mobile}</p>
                <p>Thời gian tạo: {new Date().toLocaleString()}</p>
            </div>

            <h3 className="text-center font-semibold my-4">Hóa đơn mua hàng</h3>

            {/* Thông tin thanh toán */}
            {renderPaymentInfo()}

            {/* Danh sách sản phẩm */}
            {renderProductList()}

            {/* Thông tin tổng tiền và QR chuyển khoản */}
            {renderSummaryAndQR()}
        </div>
    );
};
