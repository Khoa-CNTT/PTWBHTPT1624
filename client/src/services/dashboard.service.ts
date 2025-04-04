import { adminClient } from '../config/httpRequest';

// Lấy dữ liệu Dashboard
const apiGetDashboardStats = async () => {
    try {
        const res = await adminClient.get('/v1/api/dashboard');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export { apiGetDashboardStats };