import React from 'react';
import { formatMoney } from '../../utils/formatMoney';
import { formatDate } from '../../utils/format/formatDate';
import { IVoucher } from '../../interfaces/voucher.interfaces';

// Định nghĩa kiểu cho props của component VoucherItem
interface VoucherProps {
    voucher: IVoucher;
    category?: string;
    onSave?: (voucher: IVoucher) => void;
}

const VoucherItem: React.FC<VoucherProps> = ({ voucher, category = 'Toàn Ngành Hàng', onSave }) => {
    // Hàm xử lý sự kiện click nút "Lưu"
    const handleSave = () => {
        if (onSave) {
            onSave(voucher);
        }
    };

    // Tính giá trị giảm giá tối đa
    const maxDiscount = voucher.voucher_max_price ?? voucher.voucher_value;

    return (
        <div className="flex items-center border border-gray-200 px-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
            {/* Phần bên trái: Logo và danh mục */}
            <div className="bg-orange-600 text-white p-3 rounded-tl-lg rounded-bl-lg text-center w-[30%]">
                <span className="block text-sm font-bold uppercase">Voucher Xtra</span>
                <span className="block text-xs mt-1">{category}</span>
            </div>

            {/* Phần giữa: Thông tin voucher */}
            <div className="flex-1 p-3">
                <span className="block text-base font-bold text-gray-800">
                    {voucher.voucher_name} - Giảm tối đa {formatMoney(maxDiscount)}
                </span>
                <span className="block text-xs text-gray-600 mt-1">Đơn tối thiểu {formatMoney(voucher.voucher_min_order_value ?? 0)}</span>
                <span className="block text-xs text-gray-600 mt-1">Có hiệu lực đến {formatDate(voucher.voucher_end_date ?? 0)}</span>
            </div>

            {/* Phần bên phải: Nút hành động */}
            <div className="p-3">
                <button
                    type="button"
                    onClick={handleSave}
                    className="bg-[#FB5630] text-white border-none py-2 px-5 rounded-lg cursor-pointer font-medium hover:bg-orange-700 transition-colors duration-200">
                    Lưu
                </button>
            </div>
        </div>
    );
};

export default VoucherItem;
