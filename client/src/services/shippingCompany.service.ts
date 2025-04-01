import { adminClient, apiClient } from '../config/httpRequest';

// API lấy danh sách tất cả công ty vận chuyển
const apiGetAllShippingCompanies = async (queries: { limit: number; page: number }) => {
    try {
        const res = await apiClient.get('/v1/api/shippingCompany/all', {
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

// API tìm kiếm công ty vận chuyển theo tên
const apiSearchShippingCompanies = async (name: string) => {
    try {
        const res = await adminClient.get('/v1/api/shippingCompany/search', {
            params: { name },
        });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API tạo mới công ty vận chuyển (Admin Only)
const apiCreateShippingCompany = async (shippingData: object) => {
    try {
        const res = await adminClient.post('/v1/api/shippingCompany/add', shippingData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API lấy chi tiết công ty vận chuyển theo ID
const apiGetShippingCompanyById = async (id: string) => {
    try {
        const res = await adminClient.get(`/v1/api/shippingCompany/${id}/search`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API cập nhật công ty vận chuyển theo ID (Admin Only)
const apiUpdateShippingCompany = async (id: string, shippingData: object) => {
    try {
        const res = await adminClient.put(`/v1/api/shippingCompany/${id}/update`, shippingData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API xóa công ty vận chuyển theo ID (Admin Only)
const apiDeleteShippingCompany = async (id: string) => {
    try {
        const res = await adminClient.delete(`/v1/api/shippingCompany/${id}/delete`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export {
    apiGetAllShippingCompanies,
    apiSearchShippingCompanies,
    apiCreateShippingCompany,
    apiGetShippingCompanyById,
    apiUpdateShippingCompany,
    apiDeleteShippingCompany,
};
