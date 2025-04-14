import React, { memo } from 'react';
import { fire_icon } from '../../assets';
import { formatMoney } from '../../utils/formatMoney';
import { Link } from 'react-router-dom';
import { IProductItem } from '../../interfaces/product.interfaces';

// eslint-disable-next-line react-refresh/only-export-components
const CardShockDiscount: React.FC<{ product: IProductItem }> = ({ product }) => {
    const { product_discount, _id, product_price, product_thumb, product_slug } = product;
    // Calculate percentage sold with fallback
    // const soldPercentage = product_quantity > 0 ? Math.min(Math.round((product_sold / product_quantity) * 100), 100) : 0;

    return (
        <Link to={`${product_slug}/${_id}`} className="flex flex-col w-full h-full gap-2 px-3 rounded-sm hover:shadow-cart cursor-pointer">
            <div className="w-2/3 h-[120px] rounded-md overflow-hidden mx-auto">
                <img className="w-full h-full object-contain" src={product_thumb} alt="Product thumbnail" />
            </div>
            <div className="flex w-full gap-2 text-red_custom justify-center items-center">
                <p className="text-base font-medium">{formatMoney(product_price)}</p>
                <span className="border border-red_custom rounded-sm px-1 text-xs">{`-${product_discount}%`}</span>
            </div>
            <div className="relative mb-2">
                <button className="relative overflow-hidden flex w-full text-sm py-1 text-white  bg-red_custom  rounded-2xl justify-center items-center hover:opacity-80 z-10">
                    <span className="z-10"> Mua ngay kẻo hết</span>
                    {/* <div className={`absolute top-0 left-0 h-full  bg-red_custom  text-white  rounded-2xl`} style={{ width: `${soldPercentage}%` }} /> */}
                </button>
                <img className="absolute bottom-2 left-1 w-[30px] z-10" src={fire_icon} alt="Fire icon" />
                {/* Progress bar */}
            </div>
        </Link>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export default memo(CardShockDiscount);
