/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import ProductInCartItem from '../../../components/item/ProductInCartItem';

interface ProductListProps {
    products: any[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => (
    <div className="mb-8 rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-5 mb-4 font-medium text-sm text-gray-800">
            <span className="col-span-2">Sản phẩm</span>
            <span className="text-center">Đơn giá</span>
            <span className="text-center">Số lượng</span>
            <span className="text-center">Thành tiền</span>
        </div>
        {products.map((product) => (
            <ProductInCartItem key={product.productId} product={product} isSelector={false} />
        ))}
    </div>
);

export default ProductList;
