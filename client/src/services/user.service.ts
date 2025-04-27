/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminClient, authClient } from '../config/httpRequest';

// API lấy tất cả người dùng
const apiGetAllUser = async (queries: { limit: number; page: number }) => {
    try {
        const res = await adminClient.get('/v1/api/user/all', {
            params: queries,
        });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API thêm người dùng mới
const apiAddUser = async (userData: object) => {
    try {
        const res = await adminClient.post('/v1/api/user/add', userData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API cập nhật thông tin người dùng theo UID
const apiUpdateUser = async (uid: string, userData: object) => {
    try {
        const res = await adminClient.put(`/v1/api/user/${uid}/update`, userData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API xóa người dùng theo UID
const apiDeleteUser = async (uid: string) => {
    try {
        const res = await adminClient.delete(`/v1/api/user/${uid}/delete`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API bật/tắt khóa người dùng theo UID
const apiToggleBlockUser = async (uid: string, isBlocked: boolean) => {
    try {
        const res = await adminClient.put(`/v1/api/user/${uid}/toggle-block`, { isBlocked });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
// API bật/tắt khóa người dùng theo UID
const apiGetDetailUser = async () => {
    try {
        const res = await authClient.get('/v1/api/user/profile');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
// API tìm kiếm người dùng theo tên hoặc email
const apiSearchUsers = async (searchQuery: string) => {
    try {
        const res = await adminClient.get('/v1/api/user/search', {
            params: { name: searchQuery }, // Truyền search query vào tham số của API
        });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
const apiChangePassword = async (oldPassword: string, newPassword: string) => {
    try {
        const res = await authClient.put('/v1/api/user/change-password', {
            oldPassword,
            newPassword,
        });
        return res.data;
    } catch (error: any) {
        return {
            success: false,
            message: error?.response?.data?.message || 'Đã xảy ra lỗi!',
            code: error?.response?.data?.code || 500,
        };
    }
};
const apiUpdateProfile = async (data: any) => {
    try {
        const res = await authClient.put('/v1/api/user/profile/update', data);
        return res.data;
    } catch (error: any) {
        return {
            success: false,
            message: error?.response?.data?.message || 'Đã xảy ra lỗi!',
            code: error?.response?.data?.code || 500,
        };
    }
};
// API gọi để chơi Lucky Box
import { AxiosError } from 'axios'; // Đảm bảo bạn đã import AxiosError từ axios

// API gọi để chơi Lucky Box
const apiPlayLuckyBox = async (userId: string) => {
    try {
        const res = await authClient.post('/v1/api/user/luckbox', { userId });
        return res.data;
    } catch (error) {
        // Kiểm tra nếu lỗi là một instance của AxiosError
        if (error instanceof AxiosError) {
            // Kiểm tra có response hay không và lấy thông báo lỗi
            const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi!';
            return {
                success: false,
                message: errorMessage,
            };
        } else {
            // Nếu không phải lỗi từ Axios, trả về lỗi chung
            return {
                success: false,
                message: 'Đã xảy ra lỗi không xác định!',
            };
        }
    }
};

export { apiPlayLuckyBox,apiChangePassword, apiSearchUsers, apiUpdateProfile, apiGetDetailUser, apiGetAllUser, apiAddUser, apiUpdateUser, apiDeleteUser, apiToggleBlockUser };
