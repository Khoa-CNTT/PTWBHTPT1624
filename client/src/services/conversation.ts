import { adminClient, authClient } from '../config/httpRequest';

// API lấy tất cả người dùng
export const apiCreateConversation = async () => {
    try {
        const res = await authClient.post('/v1/api/conversation/create');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
export const apiGetConversationUser = async () => {
    try {
        const res = await authClient.get('/v1/api/conversation/user');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
export const getAllConversations = async () => {
    try {
        const res = await adminClient.get('/v1/api/conversation');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
export const addAdminToConversation = async (conversationId: string) => {
    try {
        const res = await adminClient.put(`/v1/api/conversation/${conversationId}/add-admin`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
export const deleteConversation = async (conversationId: string) => {
    try {
        const res = await adminClient.delete(`/v1/api/conversation/${conversationId}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
