import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useModal } from '../../../hooks/useModal';
import { Pagination, showNotification, TableSkeleton } from '../../../components';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import { IAdmin } from '../../../interfaces/admin.interfaces';
import { apiAddAdmin, apiDeleteAdmin, apiGetAllAdmin, apiUpdateAdmin } from '../../../services/admin.service';
import EmployeeTable from './EmployeeTable';
import EmployeeModal from './EmployeeModal';

export default function EmployeeManage() {
    const [employees, setEmployees] = useState<IAdmin[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedEmployee, setSelectedAdmin] = useState<IAdmin | any>({});
    const { openModal, isOpen, closeModal } = useModal();
    useEffect(() => {
        const fetchApi = async () => {
            const res = await apiGetAllAdmin();
            if (!res.success) return;
            const data = res.data;
            setEmployees(data.admins);
            setTotalPage(data.totalPage);
        };
        fetchApi();
    }, [currentPage]);
    const handleAdd = () => {
        setSelectedAdmin(null);
        openModal();
    };
    const handleEdit = (employee: IAdmin) => {
        setSelectedAdmin(employee);
        openModal();
    };
    const handleSave = async (data: IAdmin) => {
        let res;
        if (data._id) {
            res = await apiUpdateAdmin(data._id, data);
        } else {
            res = await apiAddAdmin(data);
        }
        if (!res?.success) {
            showNotification(res?.message, false);
            return;
        }
        showNotification(data._id ? 'Cập nhật thành công!' : 'Thêm thành công!', true);
        // Cập nhật danh sách Nhân viên mà không cần reload trang
        setEmployees(
            (prev) =>
                data._id
                    ? prev.map((item) => (item._id === data._id ? res.data : item)) // Cập nhật Nhân viên đã có
                    : [res.data, ...prev], // Thêm Nhân viên mới
        );
        closeModal();
    };
    const handleDelete = async (id: string) => {
        if (!id) return;
        if (!confirm('Bạn có muốn xóa không?')) return;
        const res = await apiDeleteAdmin(id);
        if (!res?.success) {
            showNotification(res?.message, false);
            return;
        }
        setEmployees((prev) => prev.filter((item) => item._id != id));
        showNotification('Xóa thành công', true);
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };
    if (employees.length === 0) return <TableSkeleton />;
    return (
        <>
            <PageMeta title="Quản lý Nhân viên" />
            <PageBreadcrumb pageTitle="Nhân viên" />
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="flex justify-end">
                    <button
                        onClick={handleAdd}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
                        <AddIcon />
                        Thêm
                    </button>
                </div>
                <EmployeeTable employees={employees} onEdit={handleEdit} onDelete={handleDelete} />
                {totalPage > 0 && <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />}
            </div>
            {isOpen && <EmployeeModal isOpen={isOpen} closeModal={closeModal} onSave={handleSave} employee={selectedEmployee} />}
        </>
    );
}
