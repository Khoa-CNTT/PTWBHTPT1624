import { adminClient, authClient } from '../config/httpRequest';

// API lấy tất cả người dùng
export const apiSendMessageByUSer = async (body: { conversationId: string; text: string; image?: string }) => {
    try {
        const res = await authClient.post('/v1/api/message/by-user', body);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
export const apiMarkMessagesAsSeenByUser = async (conversationId: string) => {
    try {
        const res = await authClient.patch(`/v1/api/message/seen-by-user/${conversationId}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
export const apiGetMessagesByConversation = async (cid: string) => {
    try {
        const res = await authClient.get(`/v1/api/message/${cid}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
export const apiGetUnreadMessagesCount = async (id: string) => {
    try {
        const res = await authClient.get(`/v1/api/message/${id}/unread`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export const apiSendMessageByAdmin = async (body: { conversationId: string; text: string; image?: string }) => {
    try {
        const res = await adminClient.post('/v1/api/message/by-admin', body);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
export const apiMarkMessagesAsSeenByAdmin = async (conversationId: string) => {
    try {
        const res = await adminClient.patch(`/v1/api/message/seen-by-admin/${conversationId}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
export const apiDeleteMessage = async (conversationId: string) => {
    try {
        const res = await adminClient.delete(`/v1/api/message/${conversationId}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
