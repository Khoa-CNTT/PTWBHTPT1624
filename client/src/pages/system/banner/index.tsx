import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

import { useModal } from '../../../hooks/useModal';
import { apiCreateBanner, apiGetAllBanners, apiUpdateBanner, apiSearchBanner, apiDeleteBanner } from '../../../services/banner.service';

import { IBanner } from '../../../interfaces/banner.interfaces';
import BannerTable from './BannerTable';
import BannerModal from './BannerModal';
import { Pagination, showNotification, TableSkeleton } from '../../../components';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import InputSearch from '../../../components/item/inputSearch';
import NotExit from '../../../components/common/NotExit';  // Import component NotExit

export default function BannerManage() {
    const [banners, setBanners] = useState<IBanner[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [selectedBanner, setSelectedCategory] = useState<IBanner | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState(false);

    const { openModal, isOpen, closeModal } = useModal();

    const fetchApi = async () => {
        setIsUploading(true);
        const res = await apiGetAllBanners({ limit: 5, page: currentPage });
        if (!res.success) return;
        const data = res.data;
        setBanners(data.banners);
        setTotalPage(data.totalPage);
        setIsUploading(false);
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

    const handleEdit = (banner: IBanner) => {
        setSelectedCategory(banner);
        openModal();
    };

    const handleSave = async (data: IBanner) => {
        let res;
        if (data._id) {
            res = await apiUpdateBanner(data._id, data);
        } else {
            res = await apiCreateBanner(data);
        }
        showNotification(res?.message, res?.success);
        if (!res?.success) return;
        closeModal();

        if (data._id) {
            setBanners((prev) => prev.map((item) => (item._id === data._id ? res.data : item)));
        } else {
            setBanners((prev) => [res.data, ...prev]);
        }
    };

    const handleDelete = async (id: string) => {
        if (!id) return;
        if (!confirm('Bạn có muốn xóa không?')) return;
        const res = await apiDeleteBanner(id);
        if (!res?.success) {
            showNotification(res?.message, false);
            return;
        }
        setBanners((prev) => prev.filter((item) => item._id !== id));
        showNotification('Xóa thành công', true);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value === '') {
            setIsSearching(false);
            fetchApi(); // reset lại danh sách khi xoá ô tìm kiếm
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            showNotification('Vui lòng nhập từ khoá tìm kiếm', false);
            return;
        }
        const res = await apiSearchBanner(searchQuery.trim());
        if (res.success) {
            setBanners(res.data); // vì API trả về dạng mảng
            setTotalPage(0); // không phân trang khi tìm kiếm
            setIsSearching(true);
        } else {
            showNotification(res.message || 'Không tìm thấy banner nào', false);
        }
    };

    if (isUploading) return <TableSkeleton />;

    return (
        <>
            <PageMeta title="Quản lý banner" />
            <PageBreadcrumb pageTitle="Banner" />
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="flex justify-between items-center mb-4">
                    {/* Ô tìm kiếm */}
                    <InputSearch handleSearch={handleSearch} handleSearchChange={handleSearchChange} searchQuery={searchQuery} />

                    {/* Button thêm banner */}
                    <button
                        onClick={handleAdd}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
                        <AddIcon />
                        Thêm
                    </button>
                </div>

                {/* Danh sách banner */}
                {banners.length === 0 ? (
                    <NotExit label="Không có banner nào" /> // Hiển thị khi không có kết quả tìm kiếm
                ) : (
                    <BannerTable banners={banners} onEdit={handleEdit} onDelete={handleDelete} />
                )}

                {!isSearching && totalPage > 0 && <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />}
            </div>

            {/* Modal thêm/sửa banner */}
            {isOpen && <BannerModal isOpen={isOpen} closeModal={closeModal} onSave={handleSave} banner={selectedBanner} />}
        </>
    );
}
