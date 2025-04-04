import { adminClient } from '../config/httpRequest';

// API lấy danh sách thông báo của người dùng
const apiGetAllOrders = async (status: string) => {
    try {
        const res = await adminClient.get('/v1/api/order/all', { params: { status } });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
const apiUpdateOrderStatus = async (data: { orderId: string; newStatus: string }) => {
    try {
        const res = await adminClient.put('/v1/api/order//update-status', data);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
export { apiGetAllOrders, apiUpdateOrderStatus };
