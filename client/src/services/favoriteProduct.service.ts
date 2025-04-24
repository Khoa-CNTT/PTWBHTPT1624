/* eslint-disable @typescript-eslint/no-explicit-any */
import { authClient } from '../config/httpRequest';

// API toggle yêu thích sản phẩm (thêm nếu chưa có, xóa nếu đã tồn tại)
export const addFavoriteProduct = async (productId: any) => {
    try {
        const res = await authClient.post('/v1/api/favorite/add', { productId });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
export const removeFavoriteProduct = async (productId: any) => {
    try {
        const res = await authClient.put('/v1/api/favorite/remove', { productId });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
// API lấy danh sách sản phẩm yêu thích của user
export const apiGetUserFavoriteProducts = async () => {
    try {
        const res = await authClient.get('/v1/api/favorite/all');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
