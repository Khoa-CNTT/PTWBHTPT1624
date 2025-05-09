import React, { memo } from 'react';
import { useCartStore } from '../../../store/cartStore';
import { apiRemoveFromCart } from '../../../services/cart.service';
import { showNotification } from '../../../components';
import ProductInCartItem from '../../../components/item/ProductInCartItem';

const ProductList: React.FC = () => {
    const { selectedProducts, productInCart, setRemoveProductInCart, setSelectedProductAll } = useCartStore();

    // const totalPriceMemo = useMemo(() => {
    //     const result = selectedProducts.reduce((total, e) => {
    //         return total + e?.product_discounted_price;
    //     }, 0);
    //     return result;
    // }, [selectedProducts]);

    const handleDeleteSelectorProduct = async () => {
        if (confirm('Bạn có muốn xóa tất cả sản phẩm đã chọn?')) {
            await Promise.all(
                selectedProducts.map((p) => {
                    setRemoveProductInCart(p?.productId);
                    return apiRemoveFromCart(p?.productId);
                }),
            );
            showNotification('Xóa thành công', true);
        }
    };

    return (
        <div className="tablet:w-full relative">
            <div className="flex flex-col gap-2 top-0 left-0 bg-background_primary py-3 ">
                <div className="flex items-center bg-white p-3 rounded-lg overflow-hidden">
                    <div className="w-[40%] flex gap-1">
                        <input
                            className="cursor-pointer rounded-md"
                            type="checkbox"
                            checked={selectedProducts?.length === productInCart?.length}
                            onChange={() => {
                                setSelectedProductAll(productInCart);
                            }}
                        />
                        <span className="text-sm text-secondary ml-1">Tất cả ({productInCart?.length} sản phẩm)</span>
                    </div>
                    <div className="tablet:hidden w-[60%] grid grid-cols-4 text-center">
                        <span className="text-sm text-secondary">Đơn giá</span>
                        <span className="text-sm text-secondary">Số lượng</span>
                        <span className="text-sm text-secondary">Thành tiền</span>
                        <span className="text-sm text-secondary cursor-pointer" onClick={handleDeleteSelectorProduct}>
                            Xóa
                        </span>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-sm overflow-hidden">
                {productInCart?.map((e) => (
                    <ProductInCartItem product={e} isSelector />
                ))}
            </div>
        </div>
    );
};

export default memo(ProductList);
