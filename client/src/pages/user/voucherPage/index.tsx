// App.tsx
import React, { useEffect, useState } from 'react';
import VoucherItem from '../../../components/item/VoucherItem';
import { IVoucher } from '../../../interfaces/voucher.interfaces';
import { apiGetAllVouchers } from '../../../services/voucher.service';
import Pagination from '../../../components/pagination';

// Định nghĩa kiểu cho props của component Voucher

const VoucherPage: React.FC = () => {
    const [vouchers, setVouchers] = useState<IVoucher[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await apiGetAllVouchers({ limit: 5, page: currentPage });
            if (!res?.success) return;
            setVouchers(res.data.vouchers);
            setTotalPage(res.data.totalPage);
        };
        fetchProducts();
    }, []);

    return (
        <div className="p-5 max-w-[600px] mx-auto">
            <div className="mb-5">
                <h3 className="text-base font-bold text-orange-600 bg-gray-100 p-3 rounded-lg">VOUCHER SHOPEE CHOICE</h3>
                <div className="flex flex-col gap-3">
                    {vouchers?.map((v) => (
                        <VoucherItem
                            discount={v.voucher_name}
                            maxDiscount={v.voucher_max_price}
                            minOrder={v.voucher_min_order_value || v.voucher_value}
                            validUntil={v.voucher_end_date}
                        />
                    ))}
                </div>
                {totalPage > 0 && <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />}
            </div>
        </div>
    );
};

export default VoucherPage;
