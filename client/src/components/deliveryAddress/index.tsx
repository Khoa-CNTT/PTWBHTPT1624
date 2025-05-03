import React, { useState } from 'react';
import useUserStore from '../../store/userStore';
import FormEditAddress from '../form/FormEditAddress';

const DeliveryAddress: React.FC = () => {
    const { user } = useUserStore();
    const [isOpenEditAddress, setIsOpenEditAddress] = useState<boolean>(false);

    return (
        <>
            <div className="rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-orange-500">Địa Chỉ Nhận Hàng</h2>
                    <span className="cursor-pointer text-base text-blue-600 hover:text-blue-800" onClick={() => setIsOpenEditAddress(true)}>
                        Thay Đổi
                    </span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                    <p className="text-sm font-semibold text-gray-900">{user.user_name}</p>
                    <span className="h-4 w-px bg-gray-300" />
                    <p className="text-sm font-semibold text-gray-900">{user.user_mobile}</p>
                </div>
                <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm text-gray-600">{user.user_address?.detail}</span>
                    {user.user_address && <span className="rounded border border-red-500 px-2 py-0.5 text-xs font-medium text-red-500">Mặc Định</span>}
                </div>
            </div>
            {isOpenEditAddress && <FormEditAddress payload={user} isEdit={true} setIsOpen={setIsOpenEditAddress} />}
        </>
    );
};

export default DeliveryAddress;
