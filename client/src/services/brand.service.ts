import { adminClient, apiClient } from '../config/httpRequest';

// Lấy tất cả thương hiệu
const apiGetAllBrands = async (queries?: { limit: number; page: number }) => {
    try {
        const res = await apiClient.get('/v1/api/brand/all', {
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

// Lấy tất cả thương hiệu theo danh mục
const apiGetBrandsInCategory = async (categoryId?: string) => {
    try {
        const res = await apiClient.get(`/v1/api/brand/${categoryId}/by-category`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Tìm kiếm thương hiệu theo tên
const apiSearchBrand = async (searchQuery: string) => {
    try {
        const res = await adminClient.get(`/v1/api/brand/search`, {
            params: { name: searchQuery },
        });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Thêm mới thương hiệu
const apiCreateBrand = async (brandData: object) => {
    try {
        const res = await adminClient.post('/v1/api/brand/add', brandData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Lấy chi tiết thương hiệu theo ID
const apiGetBrandById = async (id: string) => {
    try {
        const res = await adminClient.get(`/v1/api/brand/${id}/search`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Cập nhật thương hiệu theo ID
const apiUpdateBrand = async (id: string, brandData: object) => {
    try {
        const res = await adminClient.put(`/v1/api/brand/${id}/update`, brandData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Xóa thương hiệu theo ID
const apiDeleteBrand = async (id: string) => {
    try {
        const res = await adminClient.delete(`/v1/api/brand/${id}/delete`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export { apiGetAllBrands, apiGetBrandsInCategory, apiSearchBrand, apiCreateBrand, apiGetBrandById, apiUpdateBrand, apiDeleteBrand };
