import { apiClient, adminClient, authClient } from '../config/httpRequest';
import { IReview } from '../interfaces/review.interfaces';

// 📝 Tạo đánh giá
const apiCreateReview = async (reviewData: IReview) => {
    try {
        const res = await authClient.post('/v1/api/review/add', reviewData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
const apiUpdateReview = async (id: string, reviewData: IReview) => {
    try {
        const res = await authClient.post(`/v1/api/review/${id}/update`, reviewData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// 📖 Lấy danh sách đánh giá của sản phẩm (public)
const apiGetReviews = async (productId: string, queries?: { limit?: number; page?: number }) => {
    try {
        const res = await apiClient.get(`/v1/api/review/${productId}/search`, {
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

// ✅ Duyệt đánh giá
const apiApproveReview = async (reviewId: string) => {
    try {
        const res = await adminClient.put(`/v1/api/review/${reviewId}/approve`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// ❌ Xóa đánh giá
const apiDeleteReview = async (reviewId: string) => {
    try {
        const res = await adminClient.delete(`/v1/api/review/${reviewId}/delete`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// 📖 Lấy danh sách đánh giá theo tab (all / approved / pending)
const apiGetAdminReviews = async (tab: 'all' | 'approved' | 'pending', queries?: { limit?: number; page?: number }) => {
    try {
        const res = await adminClient.get(`/v1/api/review/${tab}`, {
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

export {
    apiCreateReview,
    apiGetReviews,
    apiApproveReview,
    apiUpdateReview,
    apiDeleteReview,
    apiGetAdminReviews, // ✅ dùng cho cả 3 tab: all, approved, pending
};
