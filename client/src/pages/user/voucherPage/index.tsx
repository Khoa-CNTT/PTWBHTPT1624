import React, { useEffect, useState } from 'react';
import VoucherItem from '../../../components/item/VoucherItem';
import { IVoucher } from '../../../interfaces/voucher.interfaces';
import { getAllSystemVouchers } from '../../../services/voucher.service';
import Pagination from '../../../components/pagination';
import { apiSaveVoucherForUser } from '../../../services/user.voucher.service';
import { showNotification } from '../../../components';
import useAuthStore from '../../../store/authStore';
import { useActionStore } from '../../../store/actionStore';
import { Sparkles } from 'lucide-react';
import useUserVoucherStore from '../../../store/userVoucherStore';

const VoucherPage: React.FC = () => {
    const [vouchers, setVouchers] = useState<IVoucher[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const { isUserLoggedIn } = useAuthStore();
    const { setOpenFeatureAuth, setIsLoading } = useActionStore();
    const { userVouchers, setUserVouchers } = useUserVoucherStore();

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await getAllSystemVouchers({ limit: 10, page: currentPage });
            if (!res?.success) return;
            setVouchers(res.data.vouchers);
            setTotalPage(res.data.totalPage);
        };
        fetchProducts();
    }, [currentPage]);

    const handleSave = async (voucher: IVoucher) => {
        if (!isUserLoggedIn) {
            setOpenFeatureAuth(true);
            return;
        }
        setIsLoading(true);
        const res = await apiSaveVoucherForUser(voucher._id);
        setIsLoading(false);
        showNotification(res.message, res.success);
        if (res.success) setUserVouchers(res.data.vc_vouchers);
    };

    return (
        <div className="p-6 sm:p-10 max-w-7xl mx-auto my-8 bg-white shadow-2xl rounded-3xl border border-gray-200">
            <div className="mb-8">
                <div className="flex items-center justify-between bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white px-6 py-4 rounded-xl shadow-lg">
                    <h3 className="text-2xl md:text-3xl font-bold tracking-wide flex items-center gap-3 animate-pulse">
                        <Sparkles className="w-7 h-7" /> ƯU ĐÃI VOUCHER HOT NHẤT
                    </h3>
                </div>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {vouchers?.map((v) => (
                    <div
                        key={v._id}
                        className="transform transition-transform hover:scale-[1.02] duration-300 hover:shadow-xl"
                    >
                        <VoucherItem
                            voucher={v}
                            onSave={handleSave}
                            userOwnedVouchers={userVouchers?.map((e) => e._id)}
                        />
                    </div>
                ))}
            </div>

            {totalPage > 1 && (
                <div className="mt-10 flex justify-center">
                    <Pagination currentPage={currentPage} totalPage={totalPage - 1} setCurrentPage={setCurrentPage} />
                </div>
            )}
        </div>
    );
};

export default VoucherPage;
