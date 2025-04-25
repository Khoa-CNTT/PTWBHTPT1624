/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { apiGetDetailUser } from '../services/user.service';
import useUserStore from '../store/userStore';
import { apiGetUserFavoriteProducts } from '../services/favoriteProduct.service';
import useAuthStore from '../store/authStore';
import useFavoriteStore from '../store/favoriteStore';
import usePurchasedStore from '../store/purchasedStore';
import { apiGetPurchasedProduct } from '../services/product.service';
import { getVoucherByUser } from '../services/user.voucher.service';
import useUserVoucherStore from '../store/userVoucherStore';

const useFetchUser = () => {
    const { setUser } = useUserStore();
    const { isUserLoggedIn } = useAuthStore();
    const { setFavoriteProducts } = useFavoriteStore();
    const { setPurchasedProducts } = usePurchasedStore();
    const { setUserVouchers } = useUserVoucherStore();

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) return;
        const fetchApiDetailUser = async () => {
            const res = await apiGetDetailUser();
            const resFavorite = await apiGetUserFavoriteProducts();
            const resPurchased = await apiGetPurchasedProduct();
            const resVoucher = await getVoucherByUser();
            setUserVouchers(resVoucher.data || []);
            setFavoriteProducts(resFavorite.data.fp_products || []);
            setPurchasedProducts(resPurchased.data.PurchasedProduct || []);
            if (res.success) setUser(res.data);
        };
        fetchApiDetailUser();
    }, [setUser, setFavoriteProducts, setPurchasedProducts, setUserVouchers, isUserLoggedIn]);
};

export default useFetchUser;
