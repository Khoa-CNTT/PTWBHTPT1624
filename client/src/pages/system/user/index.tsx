/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
    apiGetAllUser,
    apiAddUser,
    apiUpdateUser,
    apiSearchUsers,
    apiToggleBlockUser,
    apiDeleteUser, // Import the delete API function
} from '../../../services/user.service';
import { IUserProfile } from '../../../interfaces/user.interfaces';
import { useModal } from '../../../hooks/useModal';
import UserModal from './UserModal';
import UserTable from './UserTable';
import { showNotification, TableSkeleton } from '../../../components';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import Pagination from '../../../components/pagination';
import PageMeta from '../../../components/common/PageMeta';
import NotExit from '../../../components/common/NotExit';
import InputSearch from '../../../components/item/inputSearch';
import { useActionStore } from '../../../store/actionStore';

export default function UserManage() {
    const [users, setUsers] = useState<IUserProfile[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [selectedUser, setSelectedUser] = useState<IUserProfile | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState(false);
    const { setIsLoading } = useActionStore();
    const { openModal, isOpen, closeModal } = useModal();

    // Fetch danh sách người dùng
    const fetchApi = async () => {
        setIsUploading(true);
        const res = await apiGetAllUser({ limit: 5, page: currentPage });
        if (!res.success) return;
        const data = res.data;
        setUsers(data.users);
        setTotalPage(data.totalPage);
        setIsUploading(false);
    };

    useEffect(() => {
        if (!isSearching) {
            fetchApi();
        }
    }, [currentPage, isSearching]);

    const handleAdd = () => {
        setSelectedUser(null);
        openModal();
    };

    const handleEdit = (user: IUserProfile) => {
        setSelectedUser(user);
        openModal();
    };

    const handleSave = async (data: IUserProfile) => {
        let res;
        setIsLoading(true);
        if (data._id) {
            res = await apiUpdateUser(data._id, data);
        } else {
            res = await apiAddUser(data);
        }
        setIsLoading(false);
        showNotification(res?.message, res?.success);
        if (!res?.success) return;

        closeModal();

        // Refetch lại danh sách người dùng thay vì cập nhật thủ công
        fetchApi();
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
            showNotification('Vui lòng nhập từ khoá tìm kiếm', false); // Thông báo khi không có từ khoá
            return; // Dừng lại, không gọi API
        }

        setIsUploading(true); // Bắt đầu loading

        // Gửi request API tìm kiếm
        const res = await apiSearchUsers(searchQuery.trim());

        // Xử lý kết quả trả về
        if (res.success) {
            setUsers(res.data); // Cập nhật danh sách người dùng từ API
            setTotalPage(0); // Không phân trang khi tìm kiếm
            setIsSearching(true); // Đánh dấu đang tìm kiếm
        } else {
            showNotification(res.message || 'Không tìm thấy người dùng nào', false);
        }

        setIsUploading(false); // Kết thúc loading
    };

    const handleBlock = (id: string, isBlocked: boolean) => {
        const toggleBlock = async () => {
            setIsLoading(true);
            const res = await apiToggleBlockUser(id, isBlocked);
            setIsLoading(false);
            if (res.success) {
                setUsers((prevUsers) => prevUsers.map((user) => (user._id === id ? { ...user, user_isBlocked: isBlocked } : user)));
                showNotification(isBlocked ? 'Chặn người dùng thành công' : 'Bỏ chặn người dùng thành công', true);
            } else {
                showNotification(res.message || 'Không thể thay đổi trạng thái chặn', false);
            }
        };
        toggleBlock();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bạn có muốn xóa người dùng này không?')) {
            setIsLoading(true);
            const res = await apiDeleteUser(id);
            setIsLoading(false);
            if (res.success) {
                setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
                showNotification('Xóa người dùng thành công', true);
            } else {
                showNotification(res.message || 'Xóa người dùng thất bại', false);
            }
        }
    };

    if (isUploading) return <TableSkeleton />;

    return (
        <>
            <PageMeta title="Quản lý người dùng" />
            <PageBreadcrumb pageTitle="Người dùng" />

            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="flex justify-between items-center mb-4">
                    <InputSearch handleSearch={handleSearch} handleSearchChange={handleSearchChange} searchQuery={searchQuery} />
                    <button
                        onClick={handleAdd}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
                        <AddIcon />
                        Thêm
                    </button>
                </div>

                {users.length === 0 ? (
                    <NotExit label="Không có người dùng nào" />
                ) : (
                    <>
                        <UserTable
                            users={users}
                            onEdit={handleEdit}
                            onBlock={handleBlock}
                            onDelete={handleDelete} // Pass the handleDelete function
                        />
                        {!isSearching && totalPage > 0 && <Pagination currentPage={currentPage} totalPage={totalPage - 1} setCurrentPage={setCurrentPage} />}
                    </>
                )}
            </div>

            {isOpen && <UserModal isOpen={isOpen} closeModal={closeModal} onSave={handleSave} user={selectedUser} />}
        </>
    );
}
