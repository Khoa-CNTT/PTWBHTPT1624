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
import { useCartStore } from '../store/cartStore';

const useFetchUser = () => {
    const { setUser } = useUserStore();
    const { setFavoriteProducts } = useFavoriteStore();
    const { setPurchasedProducts } = usePurchasedStore();
    const { setUserVouchers } = useUserVoucherStore();
    const { clearUser } = useUserStore();
    const { isUserLoggedIn, logoutUser } = useAuthStore();
    const { setAddProductInCartFromApi } = useCartStore();
    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) return;
        const fetchApiDetailUser = async () => {
            const res = await apiGetDetailUser();
            if (!res.success) {
                clearUser();
                logoutUser();
                setAddProductInCartFromApi([]);
            }
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
