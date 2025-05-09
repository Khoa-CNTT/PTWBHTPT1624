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
import { apiLogout } from '../services/auth.user.service';

const useFetchUser = () => {
    const { setUser } = useUserStore();
    const { setFavoriteProducts } = useFavoriteStore();
    const { setPurchasedProducts } = usePurchasedStore();
    const { setUserVouchers } = useUserVoucherStore();
    const { isUserLoggedIn, logoutUser } = useAuthStore();

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken || !isUserLoggedIn) return;

        const fetchUserData = async () => {
            const userRes = await apiGetDetailUser();
            if (!userRes.success) {
                console.warn('Failed to fetch user:', userRes);
                await apiLogout();
                logoutUser();
                return;
            }
            setUser(userRes.data);
            const [favoriteRes, purchasedRes, voucherRes] = await Promise.all([apiGetUserFavoriteProducts(), apiGetPurchasedProduct(), getVoucherByUser()]);
            setFavoriteProducts(favoriteRes?.data?.fp_products || []);
            setPurchasedProducts(purchasedRes?.data?.PurchasedProduct || []);
            setUserVouchers(voucherRes?.data || []);
        };

        fetchUserData();
    }, [isUserLoggedIn, setUser, setFavoriteProducts, setPurchasedProducts, setUserVouchers, logoutUser]);
};

export default useFetchUser;
