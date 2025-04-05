import { useEffect, useState } from 'react';
import { Pagination, TableSkeleton } from '../../../components';
import PageMeta from '../../../components/common/PageMeta';
import PageBreadcrumb from '../../../components/common/PageBreadCrumb';
import UserTable from './UserTable';
import { IUserProfile } from '../../../interfaces/user.interfaces';
import { apiGetAllUser, apiToggleBlockUser } from '../../../services/user.service';
import useDebounce from '../../../hooks/useDebounce';

export default function UserManage() {
    const [users, setUsers] = useState<IUserProfile[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [blockStatus, setBlockStatus] = useState<{ id: string; isBlocked: boolean } | null>(null);

    // Debounce blockStatus với thời gian chờ 1 giây
    const debouncedBlockStatus = useDebounce(blockStatus, 1000);

    // Lấy danh sách người dùng từ API
    useEffect(() => {
        const fetchApi = async () => {
            const res = await apiGetAllUser({ limit: 5, page: currentPage });
            if (!res.success) {
                console.error('Lỗi khi lấy dữ liệu người dùng:', res.message);
                return;
            }
            const data = res.data;
            // Kiểm tra dữ liệu trước khi cập nhật state
            if (data && Array.isArray(data.users)) {
                setUsers(data.users);
                setTotalPage(data.totalPage);
            } else {
                console.error('Dữ liệu từ API không hợp lệ');
            }
        };
        fetchApi();
    }, [currentPage]);

    // Xử lý block/unblock sau khi debounce
    useEffect(() => {
        if (debouncedBlockStatus) {
            const { id, isBlocked } = debouncedBlockStatus;
            const toggleBlock = async () => {
                await apiToggleBlockUser(id, isBlocked);
            };
            toggleBlock();
        }
    }, [debouncedBlockStatus]);
    // Hàm xử lý khi checkbox thay đổi
    const handleBlock = (id: string, isBlocked: boolean) => {
        setBlockStatus({ id, isBlocked });
        setUsers((prevUsers) => prevUsers.map((user) => (user._id === id ? { ...user, user_isBlocked: isBlocked } : user)));
    };
    if (users.length === 0) return <TableSkeleton columns={6} />;

    return (
        <>
            <PageMeta title="Quản lý người dùng" />
            <PageBreadcrumb pageTitle="Người dùng" />
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-2 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
                <UserTable users={users} onBlock={handleBlock} />
                {totalPage > 0 && <Pagination currentPage={currentPage} totalPage={totalPage} setCurrentPage={setCurrentPage} />}
            </div>
        </>
    );
}
