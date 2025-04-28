import { useEffect, useState } from 'react';

import { apiCreateRole, apiUpdateRole, apiDeleteRole, apiGetAllRoles } from '../../../services/role.service';
import AddIcon from '@mui/icons-material/Add';
import { useModal } from '../../../hooks/useModal';
import RoleModal from './RoleModal';
import RoleTable from './RoleTable';
import { showNotification, TableSkeleton } from '../../../components';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import Pagination from '../../../components/pagination';
import PageMeta from '../../../components/common/PageMeta';
import { IRole } from '../../../interfaces/role.interfaces';
import { useActionStore } from '../../../store/actionStore';

export default function RoleManage() {
    const [roles, setRoles] = useState<IRole[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
    const { openModal, isOpen, closeModal } = useModal();
    const [loading, setLoading] = useState<boolean>(false);
    const { setIsLoading } = useActionStore();

    useEffect(() => {
        const fetchApi = async () => {
            setLoading(true);
            const res = await apiGetAllRoles({ limit: 5, page: currentPage });
            if (!res.success) return;
            const data = res.data;
            setRoles(data.roles);
            setTotalPage(data.totalPage);
            setLoading(false);
        };
        fetchApi();
    }, [currentPage]);

    const handleAdd = () => {
        setSelectedRole(null);
        openModal();
    };

    const handleEdit = (role: IRole) => {
        setSelectedRole(role);
        openModal();
    };
    const handleSave = async (data: IRole) => {
        let res;
        setIsLoading(true);
        if (data._id) {
            res = await apiUpdateRole(data._id, data);
        } else {
            res = await apiCreateRole(data);
        }
        setIsLoading(false);
        showNotification(res?.message, res?.success);
        if (!res?.success) return;
        closeModal();
        // Cập nhật danh sách vai trò mà không cần reload trang
        setRoles(
            (prev) =>
                data._id
                    ? prev.map((item) => (item._id === data._id ? res.role : item)) // Cập nhật vai trò đã có
                    : [res.role, ...prev], // Thêm vai trò mới
        );
    };
    const handleDelete = async (id: string) => {
        if (!id) return;
        if (!confirm('Bạn có muốn xóa không?')) return;
        setIsLoading(true);
        const res = await apiDeleteRole(id);
        setIsLoading(false);
        if (!res?.success) {
            showNotification(res?.message, false);
            return;
        }
        setRoles((prev) => prev.filter((item) => item._id != id));
        showNotification('Xóa thành công', true);
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };
    if (loading) return <TableSkeleton />;
    return (
        <>
            <PageMeta title="Quản lý vai trò" />
            <PageBreadcrumb pageTitle="Vai trò" />
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="flex justify-end">
                    <button
                        onClick={handleAdd}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
                        <AddIcon />
                        Thêm
                    </button>
                </div>
                <RoleTable roles={roles} onEdit={handleEdit} onDelete={handleDelete} />
                {totalPage > 0 && <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />}
            </div>
            {isOpen && <RoleModal isOpen={isOpen} closeModal={closeModal} onSave={handleSave} role={selectedRole} />}
        </>
    );
}
