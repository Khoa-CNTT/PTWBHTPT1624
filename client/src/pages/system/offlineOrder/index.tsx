/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import QRScanner from '../../../components/QRScanner';
import { apiGetScanProduct } from '../../../services/product.service';
import { ButtonOutline, showNotification } from '../../../components';
import { IProduct } from '../../../interfaces/product.interfaces';
import DeleteIcon from '@mui/icons-material/Delete';
import NotExit from '../../../components/common/NotExit';
import { formatMoney } from '../../../utils/formatMoney';
import AddIcon from '@mui/icons-material/Add';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography } from '@mui/material';

export interface IProductInCart {
    image: string;
    productId: string | any;
    quantity: number;
    price: number;
    discount: number;
    name?: string;
}

const OfflineOrder: React.FC = () => {
    const [carts, setCarts] = useState<IProductInCart[][]>([[]]);
    const [currentTab, setCurrentTab] = useState<number>(0);
    const [qrResult, setQrResult] = useState<string>('');

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

    const calculateTotal = () => {
        return carts[currentTab].reduce((sum, item) => {
            const finalPrice = item.price * (1 - item.discount / 100);
            return sum + finalPrice * item.quantity;
        }, 0);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 p-8 font-sans">
            <h1 className="mb-6 text-3xl  tracking-tight text-gray-900">Hóa Đơn Bán Hàng</h1>

            {/* Tabs và nút thêm hóa đơn */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex gap-3">
                    {carts.map((_, index) => (
                        <div key={index} className="relative group">
                            <button
                                onClick={() => setCurrentTab(index)}
                                className={`rounded-lg px-5 py-2 text-sm font-semibold uppercase tracking-wide transition-all duration-200 ${
                                    currentTab === index ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
                                }`}>
                                Hóa Đơn {index + 1}
                            </button>
                            {currentTab !== index && (
                                <button
                                    onClick={() => handleDeleteInvoice(index)}
                                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors">
                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                {carts.length < 5 && (
                    <ButtonOutline onClick={handleAddInvoice}>
                        <AddIcon /> Thêm Hóa Đơn
                    </ButtonOutline>
                )}
            </div>

            {/* QR Scanner */}
            <div className="mb-6 flex justify-end gap-3">
                <QRScanner setQrResult={setQrResult} />
            </div>

            {/* Bảng sản phẩm */}
            <div className="mb-6 overflow-hidden rounded-xl bg-white shadow-lg">
                <table className="w-full">
                    <thead>
                        <tr className="bg-primary text-white text-sm  tracking-wider">
                            <th className="p-4">STT</th>
                            <th className="p-4 text-left">Sản Phẩm</th>
                            <th className="p-4 text-left min-w-[100px]">Hình Ảnh</th>
                            <th className="p-4">Số Lượng</th>
                            <th className="p-4">Giá Tiền</th>
                            <th className="p-4 min-w-[100px]">Giảm Giá</th>
                            <th className="p-4 min-w-[100px]">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carts[currentTab].map((item, index) => (
                            <tr key={item.productId} className="border-t border-gray-100 hover:bg-blue-50/50 transition-colors">
                                <td className="p-4 text-center text-gray-700">{index + 1}</td>
                                <td className="p-4  text-gray-800">{item.name || 'Sản phẩm không tên'}</td>
                                <td className="p-4">
                                    {item.image && <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover shadow-sm" />}
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleQuantityChange(index, -1)}
                                            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                                            −
                                        </button>
                                        <span className="w-8 text-center text-gray-800">{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(index, 1)}
                                            className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
                                            +
                                        </button>
                                    </div>
                                </td>
                                <td className="p-4 text-center  text-gray-800">{item.price.toLocaleString()} VND</td>
                                <td className="p-4 text-center   text-gray-800">{item.discount}%</td>
                                <td className="p-4 text-center">
                                    <button onClick={() => handleRemoveProduct(index)} className="text-red-500 hover:text-red-600 transition-colors">
                                        <DeleteIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!(calculateTotal() > 0) && <NotExit label="Chưa có sản phẩm nào" />}
                {calculateTotal() > 0 && (
                    <div className="flex justify-center text-red-500 font-semibold text-center border-t-2 border-gray-100 py-2">
                        Tổng tiền:
                        <p className="text-base ml-2 font-normal text-gray-800">{formatMoney(calculateTotal())}</p>
                    </div>
                )}
            </div>
            <div className="text-end">
                {' '}
                <FormControl>
                    <FormLabel sx={{ fontSize: '13px' }}>Hình thức thanh toán</FormLabel>
                    <RadioGroup
                        row
                        name="row-radio-buttons-group"
                        // value={inputFields.voucher_method || 'fixed'}
                        // onChange={(e) => handleInputField(e, 'voucher_method')}
                    >
                        <FormControlLabel value="fixed" control={<Radio />} label={<Typography sx={{ fontSize: '12px' }}>Tiền mặt</Typography>} />
                        <FormControlLabel value="percent" control={<Radio />} label={<Typography sx={{ fontSize: '12px' }}>Chuyển khoản</Typography>} />
                    </RadioGroup>
                </FormControl>
            </div>
        </div>
    );
};

export default OfflineOrder;
