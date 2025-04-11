import React, { useEffect, useState, useMemo } from 'react';
import QRScanner from '../../../components/QRScanner';
import { apiGetScanProduct } from '../../../services/product.service';
import { showNotification } from '../../../components';
import { IProduct, IProductInCart } from '../../../interfaces/product.interfaces';
import { ConfirmationModal } from './ConfirmationModal';
import { CartTabs } from './CartTable';
import { CartTable } from './CartTabs';
import { PaymentSection } from './PaymentSection';

const OfflineOrder: React.FC = () => {
    const [carts, setCarts] = useState<IProductInCart[][]>([[]]);
    const [currentTab, setCurrentTab] = useState<number>(0);
    const [qrResult, setQrResult] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('online');
    const [discountCode, setDiscountCode] = useState<string>('');
    const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
    const [cashReceived, setCashReceived] = useState<number | ''>('');
    const [openModal, setOpenModal] = useState<boolean>(false);

    // Sử dụng useMemo để tính toán các giá trị
    const subtotal = useMemo(() => {
        return carts[currentTab].reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [carts, currentTab]);

    const discountFromProducts = useMemo(() => {
        return carts[currentTab].reduce((sum, item) => {
            const discountAmount = (item.price * item.discount) / 100;
            return sum + discountAmount * item.quantity;
        }, 0);
    }, [carts, currentTab]);

    const total = useMemo(() => {
        const additionalDiscount = (subtotal - discountFromProducts) * (appliedDiscount / 100);
        return subtotal - discountFromProducts - additionalDiscount;
    }, [subtotal, discountFromProducts, appliedDiscount]);

    const change = useMemo(() => {
        if (paymentMethod !== 'cash' || cashReceived === '') return 0;
        return Math.max(0, Number(cashReceived) - total);
    }, [paymentMethod, cashReceived, total]);

    useEffect(() => {
        const handleScanResult = async () => {
            if (!qrResult) return;
            const res = await apiGetScanProduct(qrResult);
            showNotification(res.message, res.success);
            if (res.success && res.data) {
                const newProduct: IProduct = res.data;
                updateCartWithNewProduct(newProduct);
            }
            setQrResult('');
        };
        handleScanResult();
    }, [qrResult]);

    const updateCartWithNewProduct = (newProduct: IProduct) => {
        const updatedCarts = [...carts];
        const currentCart = [...updatedCarts[currentTab]];
        const existingProductIndex = currentCart.findIndex((item) => item.productId === newProduct._id);

        if (existingProductIndex >= 0) {
            currentCart[existingProductIndex].quantity += 1;
        } else {
            currentCart.push({
                image: newProduct.product_thumb,
                productId: newProduct._id,
                quantity: 1,
                price: newProduct.product_price,
                discount: newProduct.product_discount,
                name: newProduct.product_name,
            });
        }
        updatedCarts[currentTab] = currentCart;
        setCarts(updatedCarts);
    };

    const handleQuantityChange = (index: number, delta: number) => {
        const updatedCarts = [...carts];
        const currentCart = [...updatedCarts[currentTab]];
        currentCart[index].quantity = Math.max(1, currentCart[index].quantity + delta);
        updatedCarts[currentTab] = currentCart;
        setCarts(updatedCarts);
    };

    const handleRemoveProduct = (index: number) => {
        const updatedCarts = [...carts];
        updatedCarts[currentTab] = updatedCarts[currentTab].filter((_, i) => i !== index);
        setCarts(updatedCarts);
    };

    const handleAddInvoice = () => {
        if (carts.length >= 5) {
            showNotification('Đã đạt tối đa 5 hóa đơn!', false);
            return;
        }
        setCarts([...carts, []]);
        setCurrentTab(carts.length);
    };

    const handleDeleteInvoice = (tabIndex: number) => {
        if (carts.length === 1) {
            setCarts([[]]);
            setCurrentTab(0);
            return;
        }
        const updatedCarts = carts.filter((_, index) => index !== tabIndex);
        setCarts(updatedCarts);
        setCurrentTab(tabIndex === currentTab ? Math.max(0, currentTab - 1) : tabIndex < currentTab ? currentTab - 1 : currentTab);
    };

    const handleApplyDiscountCode = () => {
        if (discountCode === 'SAVE20') {
            setAppliedDiscount(20);
            showNotification('Áp dụng mã giảm giá thành công!', true);
        } else {
            setAppliedDiscount(0);
            showNotification('Mã giảm giá không hợp lệ!', false);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleConfirmPayment = async () => {
        if (carts[currentTab].length === 0) {
            showNotification('Giỏ hàng trống, không thể thanh toán!', false);
            return;
        }
        if (paymentMethod === 'cash') {
            if (cashReceived === '' || Number(cashReceived) < total) {
                showNotification('Số tiền nhận không đủ để thanh toán!', false);
                return;
            }
        }
        setOpenModal(true);
    };

    const handlePrintSuccess = () => {
        const updatedCarts = [...carts];
        updatedCarts[currentTab] = [];
        setCarts(updatedCarts);
        setAppliedDiscount(0);
        setDiscountCode('');
        setCashReceived('');
        setOpenModal(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-8 font-sans">
            <h1 className="mb-6 text-3xl tracking-tight text-gray-900">Hóa Đơn Bán Hàng</h1>
            <CartTabs
                carts={carts}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                handleAddInvoice={handleAddInvoice}
                handleDeleteInvoice={handleDeleteInvoice}
            />
            <div className="mb-6 flex justify-end gap-3">
                <QRScanner setQrResult={setQrResult} />
            </div>
            <CartTable
                cart={carts[currentTab]}
                calculateSubtotal={subtotal}
                handleQuantityChange={handleQuantityChange}
                handleRemoveProduct={handleRemoveProduct}
            />
            <PaymentSection
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                discountCode={discountCode}
                setDiscountCode={setDiscountCode}
                appliedDiscount={appliedDiscount}
                cashReceived={cashReceived}
                setCashReceived={setCashReceived}
                handleApplyDiscountCode={handleApplyDiscountCode}
                calculateSubtotal={subtotal}
                calculateDiscountFromProducts={discountFromProducts}
                calculateTotal={total}
                calculateChange={change}
                handleConfirmPayment={handleConfirmPayment}
            />
            <ConfirmationModal
                open={openModal}
                cart={carts[currentTab]}
                paymentMethod={paymentMethod}
                cashReceived={cashReceived}
                calculateSubtotal={subtotal}
                calculateDiscountFromProducts={discountFromProducts}
                calculateTotal={total}
                calculateChange={change}
                appliedDiscount={appliedDiscount}
                handleCloseModal={handleCloseModal}
                handlePrintSuccess={handlePrintSuccess}
            />
        </div>
    );
};

export default OfflineOrder;
