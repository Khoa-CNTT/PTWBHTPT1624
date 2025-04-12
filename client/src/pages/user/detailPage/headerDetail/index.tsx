import React from 'react';
import Right from './Right';
import Left from './Left';
import { IProductDetail } from '../../../../interfaces/product.interfaces';

const HeaderDetail: React.FC<{ productDetail: IProductDetail }> = ({ productDetail }) => {
    return (
        <div className="flex tablet:flex-col bg-white">
            <Left productImage={productDetail?.product_images} imageUrl={productDetail?.product_thumb} />
            <Right productDetail={productDetail} />
        </div>
    );
};

export default HeaderDetail;
