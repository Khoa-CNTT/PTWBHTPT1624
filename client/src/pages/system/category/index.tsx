import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
    apiGetAllCategories,
    apiCreateCategory,
    apiUpdateCategory,
    apiDeleteCategory,
    apiSearchCategory, // ✅ Thêm API tìm kiếm
} from '../../../services/category.service';
import { ICategory } from '../../../interfaces/category.interfaces';
import { useModal } from '../../../hooks/useModal';
import CategoryModal from './CategoryModal';
import CategoryTable from './CategoryTable';
import { showNotification, TableSkeleton } from '../../../components';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import Pagination from '../../../components/pagination';
import PageMeta from '../../../components/common/PageMeta';
import InputSearch from '../../../components/inputSearch';

export default function CategoryManage() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>(''); // ✅ ô tìm kiếm
    const [isSearching, setIsSearching] = useState<boolean>(false); // ✅ trạng thái tìm kiếm
    const [isUploading, setIsUploading] = useState(false);

    const { openModal, isOpen, closeModal } = useModal();

    const fetchApi = async () => {
        setIsUploading(true);
        const res = await apiGetAllCategories({ limit: 5, page: currentPage });
        if (!res.success) return;
        const data = res.data;
        setCategories(data.categories);
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
        setSelectedCategory(null);
        openModal();
    };

    const handleEdit = (category: ICategory) => {
        setSelectedCategory(category);
        openModal();
    };

    const handleSave = async (data: ICategory) => {
        let res;
        if (data._id) {
            res = await apiUpdateCategory(data._id, data);
        } else {
            res = await apiCreateCategory(data);
        }
        showNotification(res?.message, res?.success);
        if (!res?.success) return;
        closeModal();
        setCategories((prev) => (data._id ? prev.map((item) => (item._id === data._id ? res.data : item)) : [res.data, ...prev]));
    };

    const handleDelete = async (id: string) => {
        if (!id) return;
        if (!confirm('Bạn có muốn xóa không?')) return;
        const res = await apiDeleteCategory(id);
        if (!res?.success) {
            showNotification(res?.message, false);
            return;
        }

        setCategories((prev) => prev.filter((item) => item._id !== id));
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
        setIsUploading(true);
        if (!searchQuery.trim()) {
            showNotification('Vui lòng nhập từ khoá tìm kiếm', false);
            return;
        }
        const res = await apiSearchCategory(searchQuery.trim());
        if (res.success) {
            setCategories(res.data); // API trả về danh sách danh mục
            setTotalPage(0);
            setIsSearching(true);
        } else {
            showNotification(res.message || 'Không tìm thấy danh mục nào', false);
        }
        setIsUploading(false);
    };

    if (isUploading) return <TableSkeleton />;

    return (
        <>
            <PageMeta title="Quản lý danh mục" />
            <PageBreadcrumb pageTitle="Danh mục" />

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

                {/* Bảng danh mục */}
                <CategoryTable categories={categories} onEdit={handleEdit} onDelete={handleDelete} />

                {/* Phân trang nếu không tìm kiếm */}
                {!isSearching && totalPage > 0 && <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />}
            </div>

            {/* Modal thêm/sửa */}
            {isOpen && <CategoryModal isOpen={isOpen} closeModal={closeModal} onSave={handleSave} category={selectedCategory} />}
        </>
    );
}
