import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { apiAddVoucher, apiDeleteVoucher, apiGetAllVouchers, apiSearchVoucherByName, apiUpdateVoucher } from '../../../services/voucher.service';
import { IVoucher } from '../../../interfaces/voucher.interfaces';
import { useModal } from '../../../hooks/useModal';
import VoucherTable from './VoucherTable';
import VoucherModal from './VoucherModal';
import { showNotification, TableSkeleton, Pagination } from '../../../components';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import InputSearch from '../../../components/item/inputSearch';
import NotExit from '../../../components/common/NotExit'; // Import component NotExit

export default function VoucherManage(): JSX.Element {
    const [vouchers, setVouchers] = useState<IVoucher[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [selectedVoucher, setSelectedVoucher] = useState<IVoucher | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>(''); // Tìm kiếm
    const [isSearching, setIsSearching] = useState<boolean>(false); // Trạng thái tìm kiếm
    const [loading, setLoading] = useState<boolean>(false);

    const { openModal, isOpen, closeModal } = useModal();

    useEffect(() => {
        // Khi không tìm kiếm, fetch tất cả vouchers
        const fetchVouchers = async () => {
            setLoading(true);
            const res = await apiGetAllVouchers({ limit: 5, page: currentPage });
            if (!res.success) return;
            setVouchers(res.data.vouchers);
            setTotalPage(res.data.totalPage);
            setLoading(false);
        };

        fetchVouchers();
    }, [currentPage]);

    const handleAdd = () => {
        setSelectedVoucher(null);
        openModal();
    };

    const handleEdit = (voucher: IVoucher) => {
        setSelectedVoucher(voucher);
        openModal();
    };

    const handleSave = async (data: IVoucher) => {
        console.log('data', data);
        let res;
        if (data._id) {
            res = await apiUpdateVoucher(data._id, data);
        } else {
            res = await apiAddVoucher(data);
        }
        showNotification(res?.message, res?.success);
        if (!res?.success) return;
        closeModal();

        // Nếu update thành công, update lại voucher trong state mà không cần F5
        if (data._id) {
            // Nếu có _id, thay thế voucher cũ bằng voucher mới (được cập nhật)
            setVouchers((prev) => prev.map((item) => (item._id === data._id ? { ...item, ...data } : item)));
        } else {
            // Nếu là tạo mới, thêm voucher vào đầu danh sách
            setVouchers((prev) => [res.data, ...prev]);
        }
    };

    const handleDelete = async (id: string) => {
        if (!id) return;
        if (!confirm('Bạn có muốn xóa không?')) return;
        const res = await apiDeleteVoucher(id);
        if (!res?.success) {
            showNotification(res?.message, false);
            return;
        }
        setVouchers((prev) => prev.filter((item) => item._id !== id));
        showNotification('Xóa thành công', true);
    };

    // ✅ Xử lý ô tìm kiếm
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value === '') {
            // Khi ô tìm kiếm trống, gọi lại API lấy tất cả sản phẩm
            const fetchVouchers = async () => {
                const res = await apiGetAllVouchers({ limit: 5, page: currentPage });
                if (!res.success) return;
                setVouchers(res.data.vouchers);
                setTotalPage(res.data.totalPage);
            };
            fetchVouchers();
        }
    };

    // ✅ Gửi API tìm kiếm
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        const res = await apiSearchVoucherByName(searchQuery.trim());
        if (res.success) {
            setVouchers(res.data);
            setTotalPage(0); // Không phân trang khi tìm kiếm
            setIsSearching(true);
        } else {
            setVouchers([]); // Clear vouchers if no result
            showNotification(res.message || 'Không tìm thấy voucher', false);
        }
    };

    if (loading) return <TableSkeleton />;

    return (
        <>
            <PageMeta title="Quản lý voucher" />
            <PageBreadcrumb pageTitle="Voucher" />
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="flex justify-between items-center mb-4">
                    {/* ✅ Ô tìm kiếm */}
                    <InputSearch handleSearch={handleSearch} handleSearchChange={handleSearchChange} searchQuery={searchQuery} />
                    {/* Button thêm */}
                    <button
                        onClick={handleAdd}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
                        <AddIcon />
                        Thêm
                    </button>
                </div>

                {/* Danh sách voucher */}
                {vouchers.length === 0 ? (
                    <NotExit label="Không có voucher nào" />
                ) : (
                    <VoucherTable vouchers={vouchers} onEdit={handleEdit} onDelete={handleDelete} />
                )}

                {/* Phân trang nếu không tìm kiếm */}
                {!isSearching && totalPage > 0 && <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />}
            </div>

            {/* Modal thêm/sửa voucher */}
            {isOpen && <VoucherModal isOpen={isOpen} closeModal={closeModal} onSave={handleSave} voucher={selectedVoucher} />}
        </>
    );
}
