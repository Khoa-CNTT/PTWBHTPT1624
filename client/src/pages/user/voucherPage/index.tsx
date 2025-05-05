// App.tsx
import React, { useEffect, useState } from 'react';
import VoucherItem from '../../../components/item/VoucherItem';
import { IVoucher } from '../../../interfaces/voucher.interfaces';
import { getAllSystemVouchers } from '../../../services/voucher.service';
import Pagination from '../../../components/pagination';
import { apiSaveVoucherForUser } from '../../../services/user.voucher.service';
import { showNotification } from '../../../components';
import useAuthStore from '../../../store/authStore';
import { useActionStore } from '../../../store/actionStore';
import { Sparkles } from 'lucide-react'; // Icon cho đẹp
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
        <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto my-4 bg-white shadow-xl rounded-2xl">
            <div className="mb-6">
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-green-500 text-white p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold tracking-wide flex items-center gap-2">
                        <Sparkles className="w-5 h-5" /> ƯU ĐÃI VOUCHER HOT NHẤT
                    </h3>
                </div>
            </div>
            <div className="grid gap-4 grid-cols-1">
                {vouchers?.map((v) => (
                    <div key={v._id} className="transition-transform hover:scale-[1.02] duration-300">
                        <VoucherItem voucher={v} onSave={handleSave} userOwnedVouchers={userVouchers?.map((e) => e._id)} />
                    </div>
                ))}
            </div>
            {totalPage > 1 && (
                <div className="mt-6">
                    <Pagination currentPage={currentPage} totalPage={totalPage - 1} setCurrentPage={setCurrentPage} />
                </div>
            )}
        </div>
    );
};

export default VoucherPage;
