import { adminClient, authClient } from '../config/httpRequest';

// API lấy tất cả voucher
const apiGetAllVouchers = async (queries: { limit: number; page: number }) => {
    try {
        const res = await adminClient.get('/v1/api/voucher/all', {
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
const getAllSystemVouchers = async (queries: { limit: number; page: number }) => {
    try {
        const res = await adminClient.get('/v1/api/voucher/system', {
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
const getAllRedeemVouchers = async (queries: { limit: number; page: number }) => {
    try {
        const res = await adminClient.get('/v1/api/voucher/redeem', {
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

// API tìm kiếm voucher theo tên
const apiSearchVoucherByName = async (name: string) => {
    try {
        const res = await adminClient.get(`/v1/api/voucher/search?name=${name}`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API thêm mới voucher
const apiAddVoucher = async (voucherData: object) => {
    try {
        const res = await adminClient.post('/v1/api/voucher/add', voucherData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API lấy chi tiết voucher theo ID
const apiGetVoucherById = async (id: string) => {
    try {
        const res = await authClient.get(`/v1/api/voucher/${id}/search`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API cập nhật voucher theo ID
const apiUpdateVoucher = async (id: string, voucherData: object) => {
    try {
        const res = await adminClient.put(`/v1/api/voucher/${id}/update`, voucherData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// API xóa voucher theo ID
const apiDeleteVoucher = async (id: string) => {
    try {
        const res = await adminClient.delete(`/v1/api/voucher/${id}/delete`);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
// API áp dụng voucher
const apiApplyVoucher = async (voucherData: { code: string; orderValue: number }) => {
    try {
        const res = await authClient.post('/v1/api/voucher/apply', voucherData);
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
// API lấy danh sách voucher đang active cho banner
const apiGetActiveBannerVouchers = async () => {
    try {
        const res = await adminClient.get('/v1/api/voucher/active-banners');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export {
    getAllSystemVouchers,
    getAllRedeemVouchers,
    apiGetActiveBannerVouchers,
    apiApplyVoucher,
    apiGetAllVouchers,
    apiSearchVoucherByName,
    apiAddVoucher,
    apiGetVoucherById,
    apiUpdateVoucher,
    apiDeleteVoucher,
};
