import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useModal } from '../../../hooks/useModal';
import { Pagination, showNotification } from '../../../components';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import { IShipping } from '../../../interfaces/shipping.interfaces';
import {
    apiCreateShippingCompany,
    apiDeleteShippingCompany,
    apiGetAllShippingCompanies,
    apiUpdateShippingCompany,
} from '../../../services/shippingCompany.service';
import ShippingTable from './SupplierTable';
import ShippingModal from './SupplierModal';

export default function ShippingManage() {
    const [shippings, setShippings] = useState<IShipping[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [selectedShipping, setSelectedCategory] = useState<IShipping | null>(null);

    const { openModal, isOpen, closeModal } = useModal();

    useEffect(() => {
        const fetchApi = async () => {
            const res = await apiGetAllShippingCompanies({ limit: 5, page: currentPage });
            if (!res.success) return;
            const data = res.data;
            setShippings(data.ShippingCompanies);
            setTotalPage(data.totalPage);
        };
        fetchApi();
    }, [currentPage]);
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
        if (data?._id) {
            res = await apiUpdateShippingCompany(data?._id, data);
        } else {
            res = await apiCreateShippingCompany(data);
        }
        if (!res?.success) {
            showNotification(res?.message, false);
            closeModal();
            return;
        }
        showNotification(data._id ? 'Cập nhật thành công!' : 'Thêm thành công!', true);
        closeModal();
        // Cập nhật danh sách nhà cung cấp mà không cần reload trang
        setShippings(
            (prev) =>
                data._id
                    ? prev.map((item) => (item._id === data._id ? res.data : item)) // Cập nhật nhà cung cấp đã có
                    : [res.data, ...prev], // Thêm nhà cung cấp mới
        );
    };
    const handleDelete = async (id: string) => {
        if (!id) return;
        if (!confirm('Bạn có muốn xóa không?')) return;
        const res = await apiDeleteShippingCompany(id);

        if (!res?.success) {
            showNotification(res?.message, false);
            return;
        }
        setShippings((prev) => prev.filter((item) => item._id != id));
        showNotification('Xóa thành công', true);
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };
    return (
        <>
            <PageMeta title="Quản lý nhà cung cấp" />
            <PageBreadcrumb pageTitle="Nhà cung cấp" />
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="flex justify-end">
                    <button
                        onClick={handleAdd}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
                        <AddIcon />
                        Thêm
                    </button>
                </div>
                <ShippingTable shippings={shippings} onEdit={handleEdit} onDelete={handleDelete} />
                {totalPage > 0 && <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />}
            </div>
            {isOpen && <ShippingModal isOpen={isOpen} closeModal={closeModal} onSave={handleSave} shipping={selectedShipping} />}
        </>
    );
}
