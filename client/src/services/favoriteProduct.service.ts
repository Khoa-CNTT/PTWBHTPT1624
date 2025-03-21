import { apiClient  } from '../utils/httpRequest';

// API toggle yêu thích sản phẩm (thêm nếu chưa có, xóa nếu đã tồn tại)
const apiToggleFavoriteProduct = async (productId: string) => {
    try {
        const res = await apiClient.post('/v1/api/favorite/toggle', { productId });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API lấy danh sách sản phẩm yêu thích của user
const apiGetUserFavoriteProducts = async () => {
    try {
        const res = await apiClient.get('/v1/api/favorite/all');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export {
    apiToggleFavoriteProduct,
    apiGetUserFavoriteProducts,
};
