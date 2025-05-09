/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminClient, apiClient, authClient } from '../config/httpRequest';

// API tìm kiếm sản phẩm theo từ khóa
const apiSearchProduct = async (keySearch: string | any, query?: any) => {
    try {
        const res = await apiClient.get(`/v1/api/product/search/${keySearch}`, {
            params: query,
        });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
const apiGetProductById = async (id: string) => {
    try {
        const res = await apiClient.get(`/v1/api/product/${id}/detail`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
// API lấy tất cả sản phẩm
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiGetAllProducts = async (query: any) => {
    try {
        const res = await apiClient.get('/v1/api/product/all', { params: query });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
const apiGetAllProductsByAdmin = async (queries: { limit: number; page: number }) => {
    try {
        const res = await adminClient.get('/v1/api/product/all-products', {
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

// API lấy danh sách sản phẩm nổi bật
const apiGetFeaturedProducts = async (query?: { limit: number }) => {
    try {
        const res = await apiClient.get('/v1/api/product/featured', {
            params: query,
        });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API lấy danh sách sản phẩm giảm giá sốc
const apiGetFlashSaleProducts = async () => {
    try {
        const res = await apiClient.get('/v1/api/product/flash-sale');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API lấy danh sách sản phẩm mới nhất
const apiGetNewProducts = async () => {
    try {
        const res = await apiClient.get('/v1/api/product/new-product');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API lấy danh sách sản phẩm tương tự theo danh mục
const apiGetSimilarProducts = async (id: string) => {
    try {
        const res = await apiClient.get(`/v1/api/product/${id}/similar`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
const getProductSuggestions = async (keySearch: string) => {
    try {
        const res = await apiClient.get(`/v1/api/product/suggestion/${keySearch}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API thêm sản phẩm mới (Dành cho admin)
const apiCreateProduct = async (productData: object) => {
    try {
        const res = await adminClient.post('/v1/api/product/add', productData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

const apiGetScanProduct = async (product_code: string) => {
    try {
        const res = await adminClient.get(`/v1/api/product/offline-orders/scan-product`, { params: { product_code } });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API cập nhật thông tin sản phẩm (Dành cho admin)
const apiUpdateProduct = async (id: string, productData: object) => {
    try {
        const res = await adminClient.put(`/v1/api/product/${id}/update`, productData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API xóa sản phẩm (Dành cho admin)
const apiDeleteProduct = async (id: string) => {
    try {
        const res = await adminClient.delete(`/v1/api/product/${id}/delete`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API lấy danh sách sản phẩm theo trạng thái hạn sử dụng
const apiGetProductsByExpiryStatus = async (status: string, queries: { limit: number; page: number }) => {
    try {
        const res = await adminClient.get(`/v1/api/product/expiry-status/${status}`, {
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
const getTopViewedProduct = async () => {
    try {
        const res = await adminClient.get(`/v1/api/product/top-viewed`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
const apiSearchProductByImage = async (imageUrl: string) => {
    try {
        const res = await adminClient.post(`/v1/api/product/search/search-image`, { imageUrl });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
const apiGetPurchasedProduct = async (queries?: { limit: number; page: number }) => {
    try {
        const res = await authClient.get(`/v1/api/purchased/all`, {
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
const apiTrackCategoryView = async (categoryId: string) => {
    try {
        const res = await authClient.post(`/v1/api/product/track-view`, { categoryId });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
const apiProductRecommendations = async () => {
    try {
        const res = await authClient.get(`/v1/api/product/recommendations`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export {
    apiGetPurchasedProduct,
    apiSearchProductByImage,
    getTopViewedProduct,
    apiSearchProduct,
    apiGetAllProducts,
    apiGetAllProductsByAdmin,
    apiGetFeaturedProducts,
    getProductSuggestions,
    apiGetFlashSaleProducts,
    apiGetNewProducts,
    apiGetSimilarProducts,
    apiCreateProduct,
    apiGetProductById,
    apiUpdateProduct,
    apiGetScanProduct,
    apiDeleteProduct,
    apiGetProductsByExpiryStatus,
    apiTrackCategoryView,
    apiProductRecommendations,
};
