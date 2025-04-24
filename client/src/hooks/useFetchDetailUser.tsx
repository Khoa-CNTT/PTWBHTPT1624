/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { apiGetDetailUser } from '../services/user.service';
import useUserStore from '../store/userStore';
import { apiGetUserFavoriteProducts } from '../services/favoriteProduct.service';
import useAuthStore from '../store/authStore';
import useFavoriteStore from '../store/favoriteStore';

const useFetchDetailUser = () => {
    const { setUser } = useUserStore();
    const { isUserLoggedIn } = useAuthStore();
    const { setFavoriteProducts } = useFavoriteStore();

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) return;
        const fetchApiDetailUser = async () => {
            const res = await apiGetDetailUser();
            const resFavorite = await apiGetUserFavoriteProducts();
            console.log('resFavorite', resFavorite.data.fp_products);
            setFavoriteProducts(resFavorite.data.fp_products || []);
            if (res.success) setUser(res.data);
        };
        fetchApiDetailUser();
    }, [setUser, isUserLoggedIn]);
};

export default useFetchDetailUser;
