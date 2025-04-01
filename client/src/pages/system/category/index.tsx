import { useEffect, useState } from 'react';

import { apiGetAllCategories, apiCreateCategory, apiUpdateCategory, apiDeleteCategory } from '../../../services/category.service';
import { ICategory } from '../../../interfaces/category.interfaces';
import AddIcon from '@mui/icons-material/Add';
import { useModal } from '../../../hooks/useModal';
import CategoryModal from './CategoryModal';
import CategoryTable from './CategoryTable';
import { showNotification } from '../../../components';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import Pagination from '../../../components/pagination';
import PageMeta from '../../../components/common/PageMeta';

export default function CategoryManage() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

    const { openModal, isOpen, closeModal } = useModal();

    useEffect(() => {
        const fetchApi = async () => {
            const res = await apiGetAllCategories({ limit: 5, page: currentPage });

            if (!res.success) return;
            const data = res.data;
            setCategories(data.categories);
            setTotalPage(data.totalPage);
        };
        fetchApi();
    }, [currentPage]);

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
        if (!res?.success) {
            showNotification(res?.message, false);
            return;
        }
        showNotification(data._id ? 'Cập nhật thành công!' : 'Thêm thành công!', true);
        closeModal();
        // Cập nhật danh sách danh mục mà không cần reload trang
        setCategories(
            (prev) =>
                data._id
                    ? prev.map((item) => (item._id === data._id ? res.data : item)) // Cập nhật danh mục đã có
                    : [res.data, ...prev], // Thêm danh mục mới
        );
    };
    const handleDelete = async (id: string) => {
        if (!id) return;
        if (!confirm('Bạn có muốn xóa không?')) return;
        const res = await apiDeleteCategory(id);

        if (!res?.success) {
            showNotification(res?.message, false);
            return;
        }
        setCategories((prev) => prev.filter((item) => item._id != id));
        showNotification('Xóa thành công', true);
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };
    return (
        <>
            <PageMeta title="Quản lý danh mục" />
            <PageBreadcrumb pageTitle="Danh mục" />
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="flex justify-end">
                    <button
                        onClick={handleAdd}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
                        <AddIcon />
                        Thêm
                    </button>
                </div>
                <CategoryTable categories={categories} onEdit={handleEdit} onDelete={handleDelete} />
                {totalPage > 0 && <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />}
            </div>
            <CategoryModal isOpen={isOpen} closeModal={closeModal} onSave={handleSave} category={selectedCategory} />
        </>
    );
}
