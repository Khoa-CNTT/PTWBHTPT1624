/* eslint-disable @typescript-eslint/no-explicit-any */
import { adminClient, apiClient, authClient } from '../config/httpRequest';

// API lấy danh sách thông báo của người dùng
export const apiGetUserNotifications = async () => {
    try {
        const res = await authClient.get('/v1/api/notification');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API đánh dấu thông báo là đã đọc
export const apiMarkNotificationAsRead = async () => {
    try {
        const res = await authClient.put(`/v1/api/notification/read`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
export const markAllAdminNotificationsAsRead = async () => {
    try {
        const res = await adminClient.put(`/v1/api/notification/admin-read`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
export const sendNotificationToAdmin = async (data: any) => {
    try {
        const res = await apiClient.post(`/v1/api/notification/send-to-admin`, data);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
export const getAdminNotifications = async () => {
    try {
        const res = await adminClient.get(`/v1/api/notification/all-admin`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
export const sendNotificationToAll = async (data: any) => {
    try {
        const res = await adminClient.post(`/v1/api/notification/all-admin`, data);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
export const sendNotificationToUser = async (userId: string, data: any) => {
    try {
        const res = await adminClient.post(`/v1/api/notification/send-to-user/${userId}`, data);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
