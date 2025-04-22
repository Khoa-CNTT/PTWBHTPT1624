import React, { useEffect } from 'react';
import Left from './Left';
import Right from './Right';
import { imgCartEmpty } from '../../../assets';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../../store/cartStore';
import Seo from '../../../components/seo';
import ButtonOutline from '../../../components/buttonOutline';
import { PATH } from '../../../utils/const';

const CartPage: React.FC = () => {
    const { productInCart } = useCartStore();

    const navigate = useNavigate();
    useEffect(() => {
        if (productInCart.length === 0) {
            navigate('/');
        }
    }, []);
    return (
        <div className="w-full h-full">
            <Seo description="Shop bách hóa" title="Bánh Hóa Xanh" key={2} />
            <h1 className="py-4 text-2xl">Giỏ hàng</h1>
            {productInCart?.length > 0 ? (
                <div className="flex tablet:flex-col pb-8 gap-2">
                    <Left />
                    <Right />
                </div>
            ) : (
                <div className="flex flex-col items-center w-full h-full py-6 bg-white rounded-md mb-10">
                    <img src={imgCartEmpty} className="w-[190px] h-[160px]" />
                    <h3 className="text-base text-secondary my-2">Không có sản phẩm nào trong giỏ hàng của bạn.</h3>
                    <ButtonOutline className="mt-2 px-8" onClick={() => navigate(PATH.HOME)}>
                        Tiếp tục mua sắm
                    </ButtonOutline>
                </div>
            )}
        </div>
    );
};

export default CartPage;
