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

// Lấy danh sách người dùng mới tạo tài khoản trong 1 tuần
const apiGetNewUsers = async () => {
    try {
        const res = await adminClient.get('/v1/api/dashboard/new');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Lấy danh sách khách hàng tiềm năng (đã mua ít nhất 1 đơn hàng)
const apiGetPotentialCustomers = async () => {
    try {
        const res = await adminClient.get('/v1/api/dashboard/potential');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
// Lấy thống kê sản phẩm
const apiGetProductStats = async () => {
    try {
        const res = await adminClient.get('/v1/api/dashboard/stats');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export { apiGetProductStats ,apiGetDashboardStats, apiGetNewUsers, apiGetPotentialCustomers };
