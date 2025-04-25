/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { NotFound } from '../../../../components';
import useUserVoucherStore from '../../../../store/userVoucherStore';
import { formatMoney } from '../../../../utils/formatMoney';
import { formatDate } from '../../../../utils/format/formatDate';

const UserVoucherPage: React.FC = () => {
    const { userVouchers } = useUserVoucherStore();
    const isVoucherExpired = (endDate: any) => {
        return new Date(endDate) < new Date();
    };
    return (
        <div className="tablet:fixed tablet:top-0 tablet:right-0 tablet:z-[1000] w-full h-full bg-white overflow-hidden p-4 laptop:rounded-lg tablet:overflow-y-scroll">
            <div className="w-full mb-4">
                <h1 className="text-xl mb-4">Danh sách voucher</h1>
                <div className="flex flex-col bg-white pb-8 gap-10 z-0">
                    {userVouchers?.length > 0 ? (
                        <div className="grid grid-cols-2   gap-4 md:gap-6">
                            {userVouchers.map((voucher) => {
                                const expired = isVoucherExpired(voucher.voucher_end_date);
                                return (
                                    <div
                                        key={voucher._id}
                                        className={`relative flex items-center border rounded-xl shadow-sm bg-white transition-all duration-200 hover:shadow-md ${
                                            expired ? 'opacity-60 bg-gray-100' : 'hover:scale-[1.02]'
                                        }`}>
                                        {/* Left Section: Logo and Category */}
                                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-l-xl text-center w-1/3">
                                            <span className="block text-sm font-semibold uppercase tracking-wide">Voucher Xtra</span>
                                            <span className="block text-xs mt-1">Toàn Ngành Hàng</span>
                                        </div>

                                        {/* Right Section: Voucher Details */}
                                        <div className="flex-1 p-4">
                                            <span className="block text-base font-semibold text-gray-800 md:text-lg">
                                                {voucher.voucher_name} - Giảm {formatMoney(voucher.voucher_max_price ?? voucher.voucher_value)}
                                            </span>
                                            <span className="block text-sm text-gray-600 mt-1">
                                                Đơn tối thiểu {formatMoney(voucher.voucher_min_order_value)}
                                            </span>
                                            <span className="block text-sm text-gray-600 mt-1">Hiệu lực đến: {formatDate(voucher.voucher_end_date)}</span>
                                        </div>

                                        {/* Expired Label */}
                                        {expired && (
                                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                                                Hết hạn
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <NotFound>Không tìm thấy voucher nào</NotFound>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserVoucherPage;
