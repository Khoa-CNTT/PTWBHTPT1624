import { adminClient, apiClient } from '../config/httpRequest';

// Lấy tất cả danh mục
const apiGetAllCategories = async (queries?: { limit: number; page: number }) => {
    try {
        const res = await apiClient.get('/v1/api/category/all', {
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

// Tìm kiếm danh mục theo tên
const apiSearchCategory = async (searchQuery: string) => {
    try {
        const res = await adminClient.get('/v1/api/category/search', {
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

// Thêm mới danh mục
const apiCreateCategory = async (categoryData: object) => {
    try {
        const res = await adminClient.post('/v1/api/category/add', categoryData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Lấy danh mục theo ID
const apiGetCategoryById = async (id: string) => {
    try {
        const res = await adminClient.get(`/v1/api/category/${id}/search`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Cập nhật danh mục
const apiUpdateCategory = async (id: string, categoryData: object) => {
    try {
        const res = await adminClient.put(`/v1/api/category/${id}/update`, categoryData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Xóa danh mục
const apiDeleteCategory = async (id: string) => {
    try {
        const res = await adminClient.delete(`/v1/api/category/${id}/delete`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export { apiGetAllCategories, apiSearchCategory, apiCreateCategory, apiGetCategoryById, apiUpdateCategory, apiDeleteCategory };
