import { IVoucher } from '../interfaces/voucher.interfaces';

export function calculateVoucherStatus(voucher: IVoucher) {
    const now = new Date();
    const startDate = new Date(voucher.voucher_start_date);
    const endDate = new Date(voucher.voucher_end_date);

    if (now < startDate) {
        return 'Chưa bắt đầu'; // voucher chưa tới thời gian bắt đầu
    }

    if (now > endDate) {
        return 'Đã hết hạn'; // voucher đã hết hạn
    }

    const diffMs = endDate.getTime() - now.getTime(); // thời gian còn lại (ms)
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // số ngày còn lại

    if (diffDays <= 3) {
        return `Sắp hết hạn (${diffDays} ngày còn lại)`;
    }

    return `Còn hiệu lực (${diffDays} ngày còn lại)`;
}
