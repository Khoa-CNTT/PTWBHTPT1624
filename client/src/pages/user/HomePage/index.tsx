// HomePage.tsx
import React from 'react';
import Categories from './categories';
import ShockDiscount from './shockDiscount';
import ProductsFeatured from './productsFeatured';
import ProductsNew from './productsNew';
import Products from './products';
import VoucherBanner from '../../../components/VoucherBanner/VoucherBanner';
import Banner from './banner';
const HomePage: React.FC = () => {
    return (
        <div className="flex flex-col">
            {/* Hiển thị banner voucher */}
            <Banner />
            <div className="flex flex-col gap-8">
                <Categories />
                <ProductsNew />
                <ShockDiscount />
                <ProductsFeatured />
            </div>
            <Products />
            <VoucherBanner />
        </div>
    );
};

export default HomePage;
