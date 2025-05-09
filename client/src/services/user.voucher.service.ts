/* eslint-disable @typescript-eslint/no-explicit-any */
import { authClient } from '../config/httpRequest';

export const apiSaveVoucherForUser = async (voucherId: any) => {
    try {
        const res = await authClient.post('/v1/api/user-voucher/vouchers/save', { voucherId });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
// đổi điểm
export const apiRedeemVoucher = async (voucherId: any) => {
    try {
        const res = await authClient.post('/v1/api/user-voucher/vouchers/redeem', { voucherId });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

export const getVoucherByUser = async () => {
    try {
        const res = await authClient.get('/v1/api/user-voucher/vouchers/user');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};
