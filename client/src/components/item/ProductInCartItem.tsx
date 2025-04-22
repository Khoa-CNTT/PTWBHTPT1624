import React, { memo, useEffect } from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '..';
import { formatMoney } from '../../utils/formatMoney';
import { IconExcept } from '../../assets';
import { IProductInCart } from '../../interfaces/cart.interfaces';
import { useCartStore } from '../../store/cartStore';
import { apiRemoveFromCart, apiUpdateCart } from '../../services/cart.service';
import useDebounce from '../../hooks/useDebounce';

// eslint-disable-next-line react-refresh/only-export-components
const ProductInCartItem: React.FC<{ product: IProductInCart; isSelector?: boolean }> = ({ product, isSelector }) => {
    const { selectedProducts, setRemoveProductInCart, setSelectedProducts, setIncreaseProduct, setDecreaseProduct } = useCartStore();
    const navigate = useNavigate();
    const handleDeleteProductInCart = async (product: IProductInCart) => {
        if (confirm('Bạn có muốn xóa sản phẩm đang chọn?')) {
            const res = await apiRemoveFromCart(product?.productId);
            if (!res?.success) {
                showNotification('Xóa không thành công');
                return;
            }
            showNotification('Xóa thành công', true);
            setRemoveProductInCart(product?.productId);
        }
    };
    const quantity = useDebounce(product?.quantity, 500);
    useEffect(() => {
        const fetchApiUpdateCart = async () => {
            // dispatch(setIsLoading(true))
            await apiUpdateCart({ productId: product?.productId, quantity });
            //  setIsLoading(false));
        };
        fetchApiUpdateCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quantity]);

    return (
        <div
            className={`flex tablet:flex-col bg-white px-3  justify-between rounded-lg items-center  ${
                isSelector ? 'border-solid border-b-[1px] border-separate py-6' : 'py-2'
            }`}>
            <div className="tablet:w-full w-[35%] flex gap-3 items-center">
                {isSelector && (
                    <input
                        className="cursor-pointer"
                        type="checkbox"
                        checked={selectedProducts?.some((i) => i?.productId === product?.productId)}
                        onChange={() => {
                            setSelectedProducts(product);
                        }}
                    />
                )}
                <div
                    className={`ml-1 mx-2 cursor-pointer ${isSelector ? ' h-16 w-16 ' : ' h-10 w-10'}`}
                    onClick={() => {
                        if (isSelector) {
                            navigate(`/${product?.product_slug}/${product?.productId}`);
                        }
                    }}>
                    <img className="object-cover" src={product?.product_thumb} alt="" />
                </div>
                <span
                    className={`w-[70%] truncate text-sm ${isSelector ? 'cursor-pointer' : ''}`}
                    onClick={() => {
                        if (isSelector) {
                            navigate(`/${product?.product_slug}/${product?.productId}`);
                        }
                    }}>
                    {product?.product_name}
                </span>
            </div>
            <div
                className={`tablet:w-full tablet:flex  tablet:justify-end  w-[60%] grid ${
                    isSelector ? 'grid-cols-4 ' : 'grid-cols-3'
                } text-center laptop:justify-between`}>
                <div className="flex gap-1 items-center justify-center">
                    <span className="tablet:text-red_custom text-sm">{formatMoney(product?.product_discounted_price)}</span>
                    {isSelector && <span className="tablet:hidden text-xs text-secondary line-through">{formatMoney(product?.product_price)}</span>}
                </div>
                <div className={`flex items-center tablet:mx-6 mx-auto w-fit rounded-md ${isSelector ? ' border-[1px] border-solid  border-separate ' : ''}`}>
                    {isSelector && (
                        <span
                            className="text-sm"
                            onClick={() => {
                                setDecreaseProduct(product?.productId);
                            }}>
                            {IconExcept}
                        </span>
                    )}
                    <span className="mx-2 text-sm">
                        {!isSelector && <CloseIcon style={{ fontSize: '12px', color: 'rgb(128 128 137)' }} />}
                        {product?.quantity}
                    </span>
                    {isSelector && (
                        <span
                            className="flex"
                            onClick={() => {
                                setIncreaseProduct(product?.productId);
                            }}>
                            <AddIcon fontSize="small" />
                        </span>
                    )}
                </div>
                <span className="tablet:hidden text-sm text-red_custom">{formatMoney(product?.product_discounted_price * product?.quantity)}</span>
                {isSelector && (
                    <span
                        className="cursor-pointer"
                        onClick={(e) => {
                            e?.stopPropagation();
                            handleDeleteProductInCart(product);
                        }}>
                        <DeleteOutlineOutlinedIcon fontSize="small" style={{ color: 'rgb(128,128,137 )' }} />
                    </span>
                )}
            </div>
        </div>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export default memo(ProductInCartItem);
