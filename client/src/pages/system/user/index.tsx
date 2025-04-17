import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
    apiGetAllUser,
    apiAddUser,
    apiUpdateUser,
    apiSearchUsers,
    apiToggleBlockUser,
} from '../../../services/user.service';
import { IUserProfile } from '../../../interfaces/user.interfaces';
import { useModal } from '../../../hooks/useModal';
import UserModal from './UserModal';
import UserTable from './UserTable';
import { showNotification, TableSkeleton } from '../../../components';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import Pagination from '../../../components/pagination';
import PageMeta from '../../../components/common/PageMeta';
import InputSearch from '../../../components/inputSearch';

export default function UserManage() {
    const [users, setUsers] = useState<IUserProfile[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [selectedUser, setSelectedUser] = useState<IUserProfile | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState(false);

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
        if (data._id) {
            res = await apiUpdateUser(data._id, data);
        } else {
            res = await apiAddUser(data);
        }
        showNotification(res?.message, res?.success);
        if (!res?.success) return;
        closeModal();
        setUsers((prev) => (data._id ? prev.map((item) => (item._id === data._id ? res.data : item)) : [res.data, ...prev]));
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
        setIsUploading(true);
        if (!searchQuery.trim()) {
            showNotification('Vui lòng nhập từ khoá tìm kiếm', false);
            return;
        }
        const res = await apiSearchUsers(searchQuery.trim());
        if (res.success) {
            setUsers(res.data);
            setTotalPage(0);
            setIsSearching(true);
        } else {
            showNotification(res.message || 'Không tìm thấy người dùng nào', false);
        }
        setIsUploading(false);
    };

    const handleBlock = (id: string, isBlocked: boolean) => {
        const toggleBlock = async () => {
            const res = await apiToggleBlockUser(id, isBlocked);
            if (res.success) {
                setUsers((prevUsers) => prevUsers.map((user) => (user._id === id ? { ...user, user_isBlocked: isBlocked } : user)));
                showNotification(isBlocked ? 'Chặn người dùng thành công' : 'Bỏ chặn người dùng thành công', true);
            } else {
                showNotification(res.message || 'Không thể thay đổi trạng thái chặn', false);
            }
        };
        toggleBlock();
    };

    if (isUploading) return <TableSkeleton />;

    return (
        <>
            <PageMeta title="Quản lý người dùng" />
            <PageBreadcrumb pageTitle="Người dùng" />

            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <div className="flex justify-between items-center mb-4">
                    <InputSearch 
                        handleSearch={handleSearch} 
                        handleSearchChange={handleSearchChange} 
                        searchQuery={searchQuery} 
                    />
                    <button
                        onClick={handleAdd}
                        className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
                        <AddIcon />
                        Thêm
                    </button>
                </div>

                <UserTable 
                    users={users} 
                    onEdit={handleEdit} 
                    onBlock={handleBlock} 
                />

                {!isSearching && totalPage > 0 && <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />}
            </div>

            {isOpen && <UserModal isOpen={isOpen} closeModal={closeModal} onSave={handleSave} user={selectedUser} />}
        </>
    );
}
