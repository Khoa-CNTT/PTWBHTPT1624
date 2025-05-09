/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IVoucher {
    _id?: any;
    voucher_code?: string; // Mã voucher (duy nhất, không thể thay đổi)
    voucher_name: string; // Tên voucher
    voucher_description: string; // Mô tả voucher
    voucher_type: 'system' | 'user'; // Hệ thống hoặc do user đổi điểm
    voucher_required_points?: number; // Số điểm cần để đổi voucher (chỉ áp dụng cho `voucher_type = "user"`)
    voucher_thumb: string; // Ảnh thumbnail
    voucher_banner_image: string; // Ảnh banner quảng cáo
    voucher_method: 'percent' | 'fixed'; // Kiểu giảm giá: phần trăm hoặc số tiền cố định
    voucher_max_price?: any; // Mức giảm tối đa (nếu giảm giá theo phần trăm)
    voucher_value: number; // Giá trị giảm giá (VD: 10% hoặc 50,000 VND)
    voucher_max_uses: number; // Tổng số lần sử dụng
    voucher_min_order_value: number; // Giá trị đơn hàng tối thiểu để áp dụng voucher
    voucher_start_date: Date | string; // Ngày bắt đầu (có thể là Date hoặc string khi làm việc với API)
    voucher_end_date: Date | any; // Ngày kết thúc
    voucher_is_active: boolean; // Trạng thái kích hoạt của voucher
    voucher_uses_count?: number; // Số lần đã sử dụng (tuỳ chọn)
    voucher_users_used: string[]; // Danh sách ID người dùng đã sử dụng
    updatedAt?: Date;
    createdAt?: Date;
}
