import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useModal } from '../../../hooks/useModal';
import { apiCreateSupplier, apiDeleteSupplier, apiGetAllSuppliers, apiUpdateSupplier, apiSearchSupplier } from '../../../services/supplier.service';
import SupplierTable from './SupplierTable';
import SupplierModal from './SupplierModal';
import { Pagination, showNotification, TableSkeleton } from '../../../components';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import InputSearch from '../../../components/item/inputSearch'; // InputSearch component
import { ISupplier } from '../../../interfaces/supplier.interfaces';
import NotExit from '../../../components/common/NotExit'; // Đảm bảo đã import NotExit

export default function SupplierManage() {
    const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [selectedSupplier, setSelectedCategory] = useState<ISupplier | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>(''); // Trạng thái ô tìm kiếm
    const [isSearching, setIsSearching] = useState<boolean>(false); // Trạng thái tìm kiếm

    const { openModal, isOpen, closeModal } = useModal();

    // Fetch dữ liệu nhà cung cấp khi không tìm kiếm
    const fetchApi = async () => {
        const res = await apiGetAllSuppliers({ limit: 5, page: currentPage });
        if (!res.success) return;
        const data = res.data;
        setSuppliers(data.suppliers);
        setTotalPage(data.totalPage);
    };

    // Fetch dữ liệu nhà cung cấp khi tìm kiếm
    const fetchSearchResults = async () => {
        const res = await apiSearchSupplier(searchQuery); // Gọi API tìm kiếm
        if (res.success) {
            setSuppliers(res.data); // Cập nhật dữ liệu tìm kiếm
            setTotalPage(0); // Không cần phân trang khi tìm kiếm
        } else {
            showNotification(res.message || 'Không tìm thấy nhà cung cấp nào', false);
            setSuppliers([]); // Set suppliers rỗng khi không có kết quả
        }
    };

    useEffect(() => {
        if (!isSearching) {
            fetchApi();
        } else {
            fetchSearchResults(); // Khi đang tìm kiếm
        }
    }, [currentPage, isSearching, searchQuery]);

    const handleAdd = () => {
        setSelectedCategory(null);
        openModal();
    };

    const handleEdit = (supplier: ISupplier) => {
        setSelectedCategory(supplier);
        openModal();
    };

    const handleSave = async (data: ISupplier) => {
        let res;
        if (data?._id) {
            res = await apiUpdateSupplier(data?._id, data);
        } else {
            res = await apiCreateSupplier(data);
        }
        showNotification(res?.message, res?.success);
        if (!res?.success) return;
        closeModal();
        setSuppliers((prev) => (data._id ? prev.map((item) => (item._id === data._id ? res.data : item)) : [res.data, ...prev]));
    };

    const handleDelete = async (id: string) => {
        if (!id) return;
        if (!confirm('Bạn có muốn xóa không?')) return;
        const res = await apiDeleteSupplier(id);
        if (!res?.success) {
            showNotification(res?.message, false);
            return;
        }
        setSuppliers((prev) => prev.filter((item) => item._id != id));
        showNotification('Xóa thành công', true);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value === '') {
            setIsSearching(false);
            fetchApi();
        } else {
            setIsSearching(true);
        }
    };

    if (suppliers.length === 0 && !isSearching) return <TableSkeleton />;
    return (
        <>
            <PageMeta title="Quản lý nhà cung cấp" />
            <PageBreadcrumb pageTitle="Nhà cung cấp" />
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="flex justify-between items-center mb-4">
                    {/* Ô tìm kiếm */}
                    <InputSearch searchQuery={searchQuery} handleSearchChange={handleSearchChange} handleSearch={() => setIsSearching(true)} />
                    <button
                        onClick={handleAdd}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
                        <AddIcon />
                        Thêm
                    </button>
                </div>

                {/* Hiển thị danh sách nhà cung cấp */}
                {suppliers.length > 0 ? (
                    <SupplierTable suppliers={suppliers} onEdit={handleEdit} onDelete={handleDelete} />
                ) : (
                    <NotExit label="Không có nhà cung cấp nào" />
                )}

                {totalPage > 0 && <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />}
            </div>
            {isOpen && <SupplierModal isOpen={isOpen} closeModal={closeModal} onSave={handleSave} supplier={selectedSupplier} />}
        </>
    );
}
