import React from 'react';
import Banner from './Banner';
import Categories from './categories';
import ShockDiscount from './shockDiscount';
import ProductsFeatured from './productsFeatured';
import ProductsNew from './productsNew';
import Products from './products';

const HomePage: React.FC = () => {
    // const { isLoginSuccess } = useAppSelector((state) => state.auth);
    return (
        <div className="flex flex-col gap-5">
            {/* <Seo description='Shop bách hóa' title='D P S H O P V N' key={2} /> */}
            <Banner />
            <div className="flex flex-col gap-8">
                <Categories />
                <ProductsNew />
                <ShockDiscount />
                <ProductsFeatured />
            </div>
            <Products />
            {/*  {isLoginSuccess && <ProductFollowings />}
            <Products /> */}
        </div>
    );
};

export default HomePage;
