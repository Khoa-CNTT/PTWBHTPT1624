import React, { useState } from 'react';
import { IVoucher } from '../../../interfaces/voucher.interfaces';
import { formatMoney } from '../../../utils/formatMoney';
import SelectVoucherModal from '../../../components/SelectVoucherModal';

interface VoucherSelectionProps {
    selectedVoucher: IVoucher | null;
    setSelectedVoucher: (voucher: IVoucher | null) => void;
}

const VoucherSelection: React.FC<VoucherSelectionProps> = ({ selectedVoucher, setSelectedVoucher }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between px-4 py-4 border-b">
                <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <span className="text-red-500">🎫</span>
                    Shop Voucher
                </div>
                <button onClick={() => setIsModalOpen(true)} className="text-blue-600 font-medium hover:underline focus:outline-none">
                    Chọn Voucher
                </button>
            </div>
            {isModalOpen && <SelectVoucherModal setIsOpen={setIsModalOpen} setVoucher={setSelectedVoucher} />}
            {selectedVoucher && (
                <div className="flex justify-between items-center p-4 border border-gray-200 rounded-md hover:shadow-md transition">
                    <div className="flex items-start gap-4">
                        <div className="border-l-4 border-green-500 pl-3">
                            <img src={selectedVoucher.voucher_thumb} alt="Voucher" className="w-20 h-20 object-cover rounded" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-base font-semibold">
                                {selectedVoucher.voucher_name}
                                <span className="block text-sm text-red-500">Đơn tối thiểu {formatMoney(selectedVoucher.voucher_min_order_value)}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                                {selectedVoucher.voucher_method === 'fixed'
                                    ? `Giảm ${formatMoney(selectedVoucher.voucher_value)}`
                                    : `Giảm tối đa ${formatMoney(selectedVoucher.voucher_max_price)}`}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setSelectedVoucher(null)} className="text-red-500 hover:underline focus:outline-none">
                        Xóa
                    </button>
                </div>
            )}
        </div>
    );
};

export default VoucherSelection;
