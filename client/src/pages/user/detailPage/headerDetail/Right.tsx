import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { IconExcept } from '../../../../assets';
import { formatMoney } from '../../../../utils/formatMoney';
import { formatStar } from '../../../../utils/formatStar';
import { useParams } from 'react-router-dom';
import { ButtonOutline } from '../../../../components';
import { IProductDetail } from '../../../../interfaces/product.interfaces';

const Right: React.FC<{ productDetail: IProductDetail }> = ({ productDetail }) => {
    const [quantity, setQuantity] = useState<number>(1);
    // const { isLoginSuccess } = useAppSelector((state) => state.auth);
    // const currentUser = useAppSelector((state) => state.user);
    // const dispatch = useAppDispatch();
    // const { selectedProducts } = useAppSelector((state) => state.order);
    // const { mobile_ui } = useAppSelector((state) => state.action);
    const handleAddToCart = async (isBuy: boolean) => {
        console.log(isBuy);
        // if (!isLoginSuccess) {
        //     dispatch(setOpenFeatureAuth(true));
        //     return;
        // }
        // dispatch(setIsLoading(true));
        // const response = await apiAddToCart({
        //     quantity,
        //     shopId: productDetail?.user?._id,
        //     productId: productDetail?._id,
        //     totalPrice: quantity * productDetail.new_price,
        // });
        // dispatch(setIsLoading(false));
        // if (response?.success) {
        //     dispatch(setAddProductInCart(response.data));
        //     showNotification('Sản phẩm đã được thêm vào giỏ hàng', true);
        //     if (isBuy) {
        //         if (!selectedProducts.some((e) => e.productId._id === params?.pid)) {
        //             dispatch(setSelectedProducts(response.data));
        //             dispatch(setProductsByShopId());
        //         }
        //         navigate('/cart');
        //     }
        // } else {
        //     showNotification('Sản phẩm chưa được thêm vào giỏ hàng', false);
        // }
    };

    const pid = useParams().pid;
    useEffect(() => {
        setQuantity(1);
    }, [pid]);

    return (
        <>
            <div className="flex  h-full flex-1">
                <div className="flex flex-col flex-1 h-full p-4 gap-4">
                    <div className="flex flex-col w-full h-auto gap-1">
                        <p className="flex gap-1 text-[13px]">
                            Thương hiệu:
                            <a href={`/thuong-hieu/${productDetail.product_brand_id.brand_slug}`} className="text-primary">
                                {productDetail?.product_brand_id.brand_name}
                            </a>
                        </p>
                        <h1 className="text-2xl font-normal"> {productDetail?.product_name}</h1>
                        <div className="flex gap-2 items-center">
                            <div className="flex"> {formatStar(productDetail?.product_ratings || 0, '20px')}</div>
                            <h3 className="text-text_secondary text-[15px]">Đã bán {productDetail?.product_sold}</h3>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="flex-1 h-full pr-3">
                            <div className="flex flex-col gap-4">
                                <div className="flex w-full gap-2 items-end bg-[#FAFAFA] p-4 rounded-md  text-red_custom">
                                    {productDetail?.product_price && (
                                        <div className="text-4xl font-medium">{formatMoney(productDetail.product_discounted_price)}</div>
                                    )}
                                    {productDetail?.product_price && (
                                        <div className="text-sm text-text_secondary line-through">{formatMoney(productDetail?.product_price)}</div>
                                    )}
                                    {productDetail?.product_discount && <div className="text-sm font-semibold">-{productDetail?.product_discount}%</div>}
                                </div>
                                <div className="flex gap-1 text-sm">
                                    Giao đến
                                    {/* <span className="text-[15px] font-medium underline text-primary">{currentUser.address}</span> */}
                                </div>
                                <div className="flex gap-4 mt-6 items-center font-medium">
                                    <h2 className="text-sm text-text_secondary shrink-0">Số lượng</h2>
                                    <div className="flex items-center border-[1px] border-solid border-slate-300 w-[100px]  rounded-sm">
                                        <button
                                            onClick={() => {
                                                if (quantity > 1) {
                                                    setQuantity(quantity - 1);
                                                }
                                            }}
                                            className="flex w-full justify-center items-center">
                                            {IconExcept}
                                        </button>
                                        <span className="px-4 py-1 border-solid border-l-[1px] border-r-[1px] border-slate-300 ">{quantity}</span>
                                        <button
                                            onClick={() => {
                                                if (productDetail?.product_quantity > quantity) setQuantity(quantity + 1);
                                            }}
                                            className="flex w-full justify-center items-center">
                                            <AddIcon />
                                        </button>
                                    </div>
                                    <div className="text-sm text-text_secondary shrink-0">{productDetail?.product_quantity} sản phẩm có sẵn</div>
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
                                <div className="text-sm text-primary font-medium">Lượt xem: {productDetail?.product_views || 0}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Right;
