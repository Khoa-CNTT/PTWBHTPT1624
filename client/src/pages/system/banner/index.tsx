import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useModal } from '../../../hooks/useModal';
import { apiCreateBanner, apiDeleteBanner, apiGetAllBanners, apiUpdateBanner } from '../../../services/banner.service';
import BannerTable from './BannerTable';
import BannerModal from './BannerModal';
import { Pagination, showNotification } from '../../../components';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import { IBanner } from '../../../interfaces/banner.interfaces';

export default function BannerManage() {
    const [banners, setBanners] = useState<IBanner[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [selectedBanner, setSelectedCategory] = useState<IBanner | null>(null);

    const { openModal, isOpen, closeModal } = useModal();

    useEffect(() => {
        const fetchApi = async () => {
            const res = await apiGetAllBanners({ limit: 5, page: currentPage });
            if (!res.success) return;
            const data = res.data;
            setBanners(data.banners);
            setTotalPage(data.totalPage);
        };
        fetchApi();
    }, [currentPage]);
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
        if (!res?.success) {
            showNotification(res?.message, false);
            return;
        }
        showNotification(data._id ? 'Cập nhật thành công!' : 'Thêm thành công!', true);
        closeModal();
        // Cập nhật danh sách banner mà không cần reload trang
        setBanners(
            (prev) =>
                data._id
                    ? prev.map((item) => (item._id === data._id ? res.data : item)) // Cập nhật banner đã có
                    : [res.data, ...prev], // Thêm banner mới
        );
    };
    const handleDelete = async (id: string) => {
        if (!id) return;
        if (!confirm('Bạn có muốn xóa không?')) return;
        const res = await apiDeleteBanner(id);
        console.log(res);
        if (!res?.success) {
            showNotification(res?.message, false);
            return;
        }
        setBanners((prev) => prev.filter((item) => item._id != id));
        showNotification('Xóa thành công', true);
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };
    return (
        <>
            <PageMeta title="Quản lý banner" />
            <PageBreadcrumb pageTitle="Banner" />
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="flex justify-end">
                    <button
                        onClick={handleAdd}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
                        <AddIcon />
                        Thêm
                    </button>
                </div>
                <BannerTable banners={banners} onEdit={handleEdit} onDelete={handleDelete} />
                {totalPage > 0 && <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />}
            </div>
            {isOpen && <BannerModal isOpen={isOpen} closeModal={closeModal} onSave={handleSave} banner={selectedBanner} />}
        </>
    );
}
