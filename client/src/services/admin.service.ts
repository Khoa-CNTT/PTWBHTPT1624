import { adminClient } from '../config/httpRequest';

// API lấy tất cả người dùng
const apiGetAllAdmin = async () => {
    try {
        const res = await adminClient.get('/v1/api/admin/all');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API thêm người dùng mới
const apiAddAdmin = async (adminData: object) => {
    try {
        const res = await adminClient.post('/v1/api/admin/add', adminData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API cập nhật thông tin người dùng theo UID
const apiUpdateAdmin = async (uid: string, adminData: object) => {
    try {
        const res = await adminClient.put(`/v1/api/admin/${uid}/update`, adminData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API xóa người dùng theo UID
const apiDeleteAdmin = async (uid: string) => {
    try {
        const res = await adminClient.delete(`/v1/api/admin/${uid}/delete`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API bật/tắt khóa người dùng theo UID
const apiToggleBlockAdmin = async (uid: string) => {
    try {
        const res = await adminClient.put(`/v1/api/admin/${uid}/toggle-block`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
// API bật/tắt khóa người dùng theo UID
const apiGetDetailAdmin = async () => {
    try {
        const res = await adminClient.get('/v1/api/admin/profile');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
const apiUpdateProfileAmin = async (adminData: object) => {
    try {
        const res = await adminClient.put('/v1/api/admin/profile/update', adminData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

const apiSearchAdmin = async (keyword: string) => {
    try {
        const res = await adminClient.get(`/v1/api/admin/search?keyword=${keyword}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export { apiSearchAdmin,apiGetDetailAdmin, apiGetAllAdmin, apiAddAdmin, apiUpdateAdmin, apiDeleteAdmin, apiUpdateProfileAmin, apiToggleBlockAdmin };
