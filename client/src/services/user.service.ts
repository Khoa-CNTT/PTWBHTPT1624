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


export {apiSearchUsers, apiGetDetailUser, apiGetAllUser, apiAddUser, apiUpdateUser, apiDeleteUser, apiToggleBlockUser };
