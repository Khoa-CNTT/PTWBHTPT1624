import { useState } from 'react';
import SelectVoucherModal from '../../../components/SelectVoucherModal';
import { IVoucher } from '../../../interfaces/voucher.interfaces';

const SelectVoucher: React.FC<{ setSelectedVoucher: (voucher: IVoucher) => void }> = ({ setSelectedVoucher }) => {
    const [closeModal, setCloseModal] = useState<boolean>(false);
    return (
        <>
            <div className="flex items-center justify-between px-4 py-4 border-b">
                <div className="flex items-center gap-2 text-gray-800 font-medium">
                    <span className="text-red-500">🎫</span>
                    Shop Voucher
                </div>
                <button onClick={() => setCloseModal(true)} className="cursor-pointer text-blue-600 font-medium hover:underline">
                    Chọn Voucher
                </button>
            </div>
            {closeModal && <SelectVoucherModal setIsOpen={setCloseModal} setVoucher={setSelectedVoucher} />}
        </>
    );
};

export default SelectVoucher;
