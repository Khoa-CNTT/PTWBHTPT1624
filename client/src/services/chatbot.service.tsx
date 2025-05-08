import { apiClient } from '../config/httpRequest';

// Lấy tất cả danh mục
export const apiGetPrompt = async (userId?: string) => {
    try {
        const res = await apiClient.get('/v1/api/chatbot/prompt', { params: { userId } });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
