/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { formatMoney } from '../../utils/formatMoney';
import { formatDate } from '../../utils/format/formatDate';

// Định nghĩa kiểu cho props của component VoucherItem
interface VoucherProps {
    discount: string;
    maxDiscount: number | any;
    minOrder: number;
    validUntil: any;
    category?: string; // Thêm prop tùy chọn để hiển thị danh mục
    onSave?: () => void; // Thêm prop để xử lý sự kiện khi nhấn nút "Lưu"
}

const VoucherItem: React.FC<VoucherProps> = ({
    discount,
    maxDiscount,
    minOrder,
    validUntil,
    category = 'Toàn Ngành Hàng', // Giá trị mặc định
    onSave,
}) => {
    return (
        <div className="flex items-center border border-gray-200 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
            {/* Phần bên trái: Logo và danh mục */}
            <div className="bg-orange-600 text-white p-3 rounded-tl-lg rounded-bl-lg text-center w-[30%]">
                <span className="block text-sm font-bold uppercase">Voucher Xtra</span>
                <span className="block text-xs mt-1">{category}</span>
            </div>

            {/* Phần giữa: Thông tin voucher */}
            <div className="flex-1 p-3">
                <span className="block text-base font-bold text-gray-800">
                    {discount} - Giảm tối đa {formatMoney(maxDiscount)}
                </span>
                <span className="block text-xs text-gray-600 mt-1">Đơn tối thiểu {formatMoney(minOrder)}</span>
                <span className="block text-xs text-gray-600 mt-1">Có hiệu lực đến {formatDate(validUntil)}</span>
            </div>

            {/* Phần bên phải: Nút hành động */}
            <div className="p-3">
                <button
                    onClick={onSave}
                    className="bg-[#FB5630] text-white border-none py-2 px-5 rounded-lg cursor-pointer font-medium hover:bg-orange-700 transition-colors duration-200">
                    Lưu
                </button>
            </div>
        </div>
    );
};

export default VoucherItem;
