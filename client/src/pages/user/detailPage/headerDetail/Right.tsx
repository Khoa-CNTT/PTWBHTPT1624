/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { IconExcept } from '../../../../assets';
import { formatMoney } from '../../../../utils/formatMoney';
import { formatStar } from '../../../../utils/formatStar';
import { useNavigate } from 'react-router-dom';
import { ButtonOutline, showNotification } from '../../../../components';
import { IProductDetail } from '../../../../interfaces/product.interfaces';
import useAuthStore from '../../../../store/authStore';
import { useActionStore } from '../../../../store/actionStore';
import { apiAddToCart } from '../../../../services/cart.service';
import { useCartStore } from '../../../../store/cartStore';
import { IProductInCart } from '../../../../interfaces/cart.interfaces';
import useUserStore from '../../../../store/userStore';
import { addFavoriteProduct, removeFavoriteProduct } from '../../../../services/favoriteProduct.service';
import useFavoriteStore from '../../../../store/favoriteStore';
import { PATH } from '../../../../utils/const';

const Right: React.FC<{ productDetail: IProductDetail }> = ({ productDetail }) => {
    const [quantity, setQuantity] = useState<number>(1);
    const { isUserLoggedIn } = useAuthStore();
    const { setOpenFeatureAuth, setIsLoading } = useActionStore();
    const { user } = useUserStore();
    const { setAddProductInCartFromApi, setSelectedProduct, selectedProducts } = useCartStore();
    const { favoriteProducts, setFavorite, removeFavorite } = useFavoriteStore();
    const navigate = useNavigate();

    // Toggle Favorite Product
    const handleToggleFavorite = useCallback(async () => {
        if (!isUserLoggedIn) {
            setOpenFeatureAuth(true);
            showNotification('Vui lòng đăng nhập để thích sản phẩm', false);
            return;
        }
        if (favoriteProducts.some((i) => i._id === productDetail._id)) {
            removeFavorite(productDetail._id);
            await removeFavoriteProduct(productDetail._id);
        } else {
            setFavorite(productDetail);
            await addFavoriteProduct(productDetail._id);
        }
    }, [isUserLoggedIn, favoriteProducts, productDetail, setOpenFeatureAuth]);

    // Handle Add to Cart
    const handleAddToCart = async (isBuy: boolean) => {
        if (!isUserLoggedIn) {
            setOpenFeatureAuth(true);
            return;
        }
        setIsLoading(true);
        const res = await apiAddToCart({ quantity, productId: productDetail?._id });
        setIsLoading(false);
        if (res?.success) {
            setAddProductInCartFromApi(res.data.cart_products);
            if (!selectedProducts.some((p) => p.productId?._id === productDetail?._id)) {
                const selected = res.data.cart_products.find((p: IProductInCart) => p.productId === productDetail._id);
                setSelectedProduct(selected);
            }
            if (isBuy) {
                navigate(PATH.PAGE_CART);
            } else {
                showNotification(res?.message, res?.success);
            }
        }
    };

    return (
        <div className="flex h-full flex-1">
            <div className="flex flex-col flex-1 h-full p-4 gap-4">
                <div className="flex flex-col w-full h-auto gap-1">
                    <p className="flex gap-1 text-[13px]">
                        Thương hiệu:
                        <a href={`/thuong-hieu/${productDetail.product_brand_id.brand_slug}`} className="text-primary">
                            {productDetail.product_brand_id.brand_name}
                        </a>
                    </p>
                    <h1 className="text-2xl font-normal">{productDetail.product_name}</h1>
                    <div className="flex gap-2 items-center">
                        <div className="flex">{formatStar(productDetail.product_ratings || 0, '20px')}</div>
                        <h3 className="text-text_secondary text-[15px]">Đã bán {productDetail.product_sold}</h3>
                    </div>
                </div>

                <div className="flex">
                    <div className="flex-1 pr-3">
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-2 items-end bg-[#FAFAFA] p-4 rounded-md text-red_custom">
                                <div className="text-4xl font-medium">{formatMoney(productDetail.product_discounted_price)}</div>
                                <div className="text-sm text-text_secondary line-through">{formatMoney(productDetail.product_price)}</div>
                                {productDetail.product_discount && <div className="text-sm font-semibold">-{productDetail.product_discount}%</div>}
                            </div>

                            {isUserLoggedIn && (
                                <div className="flex gap-1 text-sm">
                                    Giao đến
                                    <span className="text-[15px] font-medium underline text-primary">{user.user_address?.detail}</span>
                                </div>
                            )}

                            <div className="flex gap-4 mt-6 items-center font-medium">
                                <h2 className="text-sm text-text_secondary shrink-0">Số lượng</h2>
                                <div className="flex items-center border border-slate-300 w-[100px] rounded-sm">
                                    <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="flex w-full justify-center items-center">
                                        {IconExcept}
                                    </button>
                                    <span className="px-4 py-1 border-l border-r border-slate-300">{quantity}</span>
                                    <button
                                        onClick={() => productDetail.product_quantity > quantity && setQuantity(quantity + 1)}
                                        className="flex w-full justify-center items-center">
                                        <AddIcon />
                                    </button>
                                </div>
                                <div className="text-sm text-text_secondary shrink-0">{productDetail.product_quantity} sản phẩm có sẵn</div>
                            </div>

                            <div className="flex gap-4 mt-4">
                                <ButtonOutline onClick={() => handleAddToCart(false)}>
                                    <ShoppingCartOutlinedIcon />
                                    Thêm vào giỏ hàng
                                </ButtonOutline>
                                <button
                                    className="flex gap-2 text-lg px-4 py-2 rounded-sm text-white bg-red_custom hover:bg-opacity-70"
                                    onClick={() => handleAddToCart(true)}>
                                    Mua ngay
                                </button>
                            </div>

                            <div className="text-sm text-primary font-medium">Lượt xem: {productDetail.product_views || 0}</div>

                            <div className="flex gap-1 cursor-pointer mt-4 items-center hover:text-red_custom" onClick={handleToggleFavorite}>
                                <span className="text-red-500">
                                    {favoriteProducts.some((i) => i._id === productDetail._id) ? (
                                        <FavoriteIcon fontSize="large" />
                                    ) : (
                                        <FavoriteBorderIcon fontSize="large" />
                                    )}
                                </span>
                                <span>Đã thích ({favoriteProducts?.length})</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Right;
