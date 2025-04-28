/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useModal } from '../../../hooks/useModal';
import { showNotification, TableSkeleton } from '../../../components';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import { IShipping } from '../../../interfaces/shipping.interfaces';
import Pagination from '../../../components/pagination';
import {
    apiGetAllShippingCompanies,
    apiCreateShippingCompany,
    apiDeleteShippingCompany,
    apiUpdateShippingCompany,
    apiSearchShippingCompanies, // ✅ API tìm kiếm
} from '../../../services/shippingCompany.service';
import ShippingTable from './shippingTable';
import ShippingModal from './shippingModal';
import InputSearch from '../../../components/item/inputSearch'; // ✅ InputSearch component
import { useActionStore } from '../../../store/actionStore';

export default function ShippingManage() {
    const [shippings, setShippings] = useState<IShipping[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [selectedShipping, setSelectedCategory] = useState<IShipping | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>(''); // ✅ ô tìm kiếm
    const [isSearching, setIsSearching] = useState<boolean>(false); // ✅ trạng thái tìm kiếm
    const { setIsLoading } = useActionStore();

    const { openModal, isOpen, closeModal } = useModal();

    // Hàm gọi API lấy tất cả công ty vận chuyển
    const fetchApi = async () => {
        const res = await apiGetAllShippingCompanies({ limit: 5, page: currentPage });
        if (!res.success) return;
        const data = res.data;
        setShippings(data.ShippingCompanies);
        setTotalPage(data.totalPage);
    };

    useEffect(() => {
        if (!isSearching) {
            fetchApi();
        }
    }, [currentPage, isSearching]);

    const handleAdd = () => {
        setSelectedCategory(null);
        openModal();
    };

    const handleEdit = (shipping: IShipping) => {
        setSelectedCategory(shipping);
        openModal();
    };

    const handleSave = async (data: IShipping) => {
        let res;
        setIsLoading(true);
        if (data?._id) {
            res = await apiUpdateShippingCompany(data?._id, data);
        } else {
            res = await apiCreateShippingCompany(data);
        }
        setIsLoading(false);
        showNotification(res?.message, res?.success);
        if (!res?.success) return;
        closeModal();
        setShippings((prev) => (data._id ? prev.map((item) => (item._id === data._id ? res.data : item)) : [res.data, ...prev]));
    };

    const handleDelete = async (id: string) => {
        if (!id) return;
        if (!confirm('Bạn có muốn xóa không?')) return;
        setIsLoading(true);
        const res = await apiDeleteShippingCompany(id);
        setIsLoading(false);
        if (!res?.success) {
            showNotification(res?.message, false);
            return;
        }
        setShippings((prev) => prev.filter((item) => item._id !== id));
        showNotification('Xóa thành công', true);
    };

    // ✅ Xử lý ô tìm kiếm
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value === '') {
            setIsSearching(false);
            fetchApi();
        }
    };

    // ✅ Gửi API tìm kiếm
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            showNotification('Vui lòng nhập từ khoá tìm kiếm', false);
            return;
        }
        const res = await apiSearchShippingCompanies(searchQuery.trim());
        if (res.success) {
            setShippings(res.data); // API trả về danh sách công ty vận chuyển
            setTotalPage(0); // Không cần phân trang khi tìm kiếm
            setIsSearching(true);
        } else {
            showNotification(res.message || 'Không tìm thấy công ty vận chuyển nào', false);
        }
    };

    if (shippings.length === 0) return <TableSkeleton />;

    return (
        <>
            <PageMeta title="Quản lý công ty vận chuyển" />
            <PageBreadcrumb pageTitle="Công ty vận chuyển" />
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

                {/* Bảng công ty vận chuyển */}
                <ShippingTable shippings={shippings} onEdit={handleEdit} onDelete={handleDelete} />

                {/* Phân trang nếu không tìm kiếm */}
                {!isSearching && totalPage > 0 && <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />}
            </div>

            {/* Modal thêm/sửa */}
            {isOpen && <ShippingModal isOpen={isOpen} closeModal={closeModal} onSave={handleSave} shipping={selectedShipping} />}
        </>
    );
}
