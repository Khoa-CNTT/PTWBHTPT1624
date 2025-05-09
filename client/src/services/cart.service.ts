import { authClient } from '../config/httpRequest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const apiAddToCart = async (data: { productId: string | any; quantity: number }) => {
    try {
        const res = await authClient.post('/v1/api/cart/add', data);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
export const apiUpdateCart = async (data: { productId: string; quantity: number }) => {
    try {
        const res = await authClient.put('/v1/api/cart/update', data);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
export const apiRemoveFromCart = async (pid: string) => {
    try {
        const res = await authClient.delete(`/v1/api/cart/${pid}/remote`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
export const apiClearCart = async () => {
    try {
        const res = await authClient.delete('/v1/api/cart/clear');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
export const apiGetCartByUserId = async () => {
    try {
        const res = await authClient.get(`/v1/api/cart/all`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
