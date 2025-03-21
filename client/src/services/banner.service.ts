import { adminClient, apiClient } from "../config/httpRequest";

// Lấy tất cả banners
const apiGetAllBanners = async (queries:{limit:number,page:number}) => {
    try {
        const res = await apiClient.get('/v1/api/banner/all',{
            params:queries
        });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Tìm banner theo tên
const apiSearchBanner = async (searchQuery: string) => {
    try {
        const res = await adminClient.get(`/v1/api/banner/search`, {
            params: { search: searchQuery },
        });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Thêm banner mới
const apiCreateBanner = async (bannerData: object) => {
    try {
        const res = await adminClient.post('/v1/api/banner/add', bannerData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Lấy banner theo ID
const apiGetBannerById = async (id: string) => {
    try {
        const res = await adminClient.get(`/v1/api/banner/${id}/search`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Cập nhật banner theo ID
const apiUpdateBanner = async (id: string, bannerData: object) => {
    try {
        const res = await adminClient.put(`/v1/api/banner/${id}/update`, bannerData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Xóa banner theo ID
const apiDeleteBanner = async (id: string) => {
    try {
        const res = await adminClient.delete(`/v1/api/banner/${id}/delete`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export {
    apiGetAllBanners,
    apiSearchBanner,
    apiCreateBanner,
    apiGetBannerById,
    apiUpdateBanner,
    apiDeleteBanner,
};
