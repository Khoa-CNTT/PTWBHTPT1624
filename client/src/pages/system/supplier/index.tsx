import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useModal } from '../../../hooks/useModal';
import { apiCreateSupplier, apiDeleteSupplier, apiGetAllSuppliers, apiUpdateSupplier, apiSearchSupplier } from '../../../services/supplier.service';
import SupplierTable from './SupplierTable';
import SupplierModal from './SupplierModal';
import { showNotification, TableSkeleton } from '../../../components';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import InputSearch from '../../../components/item/inputSearch';
import { ISupplier } from '../../../interfaces/supplier.interfaces';
import NotExit from '../../../components/common/NotExit';
import Pagination from '../../../components/pagination';
import { useActionStore } from '../../../store/actionStore';

export default function SupplierManage() {
    const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [selectedSupplier, setSelectedSupplier] = useState<ISupplier | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>(''); // Trạng thái ô tìm kiếm
    const [isSearching, setIsSearching] = useState<boolean>(false); // Trạng thái tìm kiếm
    const [isUploading, setIsUploading] = useState<boolean>(false); // Trạng thái đang tải dữ liệu
    const { setIsLoading } = useActionStore();

    const { openModal, isOpen, closeModal } = useModal();

    const fetchApi = async () => {
        setIsUploading(true);
        const res = await apiGetAllSuppliers({ limit: 10, page: currentPage });
        if (!res.success) return;
        const data = res.data;
        setSuppliers(data.suppliers);
        setTotalPage(data.totalPage);
        setIsUploading(false);
    };

    useEffect(() => {
        if (!isSearching) {
            fetchApi();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, isSearching]);

    const handleAdd = () => {
        setSelectedSupplier(null);
        openModal();
    };

    const handleEdit = (supplier: ISupplier) => {
        setSelectedSupplier(supplier);
        openModal();
    };

    const handleSave = async (data: ISupplier) => {
        let res;
        setIsLoading(true);
        if (data._id) {
            res = await apiUpdateSupplier(data._id, data);
        } else {
            res = await apiCreateSupplier(data);
        }
        setIsLoading(false);
        showNotification(res?.message, res?.success);
        if (!res?.success) return;
        closeModal();
        setSuppliers((prev) => (data._id ? prev.map((item) => (item._id === data._id ? res.data : item)) : [res.data, ...prev]));
    };

    const handleDelete = async (id: string) => {
        if (!id) return;
        if (!confirm('Bạn có muốn xóa không?')) return;
        setIsLoading(true);
        const res = await apiDeleteSupplier(id);
        setIsLoading(false);
        if (!res?.success) {
            showNotification(res?.message, false);
            return;
        }
        setSuppliers((prev) => prev.filter((item) => item._id !== id));
        showNotification('Xóa thành công', true);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value === '') {
            setIsSearching(false);
            fetchApi();
        }
    };

    const handleSearch = async () => {
        // Nếu từ khoá tìm kiếm trống, hiển thị thông báo lỗi mà không làm lại cuộc gọi API
        if (!searchQuery.trim()) {
            showNotification('Vui lòng nhập từ khoá tìm kiếm', false);
            return; // Dừng lại, không gọi API
        }

        setIsUploading(true); // Bắt đầu loading

        // Gửi request API tìm kiếm
        const res = await apiSearchSupplier(searchQuery.trim());

        // Xử lý kết quả trả về
        if (res.success) {
            setSuppliers(res.data); // Cập nhật danh sách nhà cung cấp từ API
            setTotalPage(0); // Không phân trang khi tìm kiếm
            setIsSearching(true); // Đánh dấu đang tìm kiếm
        } else {
            showNotification(res.message || 'Không tìm thấy nhà cung cấp nào', false);
        }

        setIsUploading(false); // Kết thúc loading
    };

    if (isUploading) return <TableSkeleton />;

    return (
        <>
            <PageMeta title="Quản lý nhà cung cấp" />
            <PageBreadcrumb pageTitle="Nhà cung cấp" />

            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="flex justify-between items-center mb-4">
                    {/* Ô tìm kiếm */}
                    <InputSearch handleSearch={handleSearch} handleSearchChange={handleSearchChange} searchQuery={searchQuery} />

                    <button
                        onClick={handleAdd}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
                        <AddIcon />
                        Thêm
                    </button>
                </div>

                {/* Hiển thị danh sách nhà cung cấp */}
                {suppliers.length === 0 ? (
                    <NotExit label="Không có nhà cung cấp nào" /> // Hiển thị khi không có nhà cung cấp
                ) : (
                    <SupplierTable suppliers={suppliers} onEdit={handleEdit} onDelete={handleDelete} />
                )}

                {/* Phân trang nếu không tìm kiếm */}
                {!isSearching && totalPage >= 1 && <Pagination currentPage={currentPage} totalPage={totalPage - 1} setCurrentPage={setCurrentPage} />}
            </div>

            {/* Modal thêm/sửa */}
            {isOpen && <SupplierModal isOpen={isOpen} closeModal={closeModal} onSave={handleSave} supplier={selectedSupplier} />}
        </>
    );
}
