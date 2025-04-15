import { useEffect, useState } from 'react';
import { Pagination, TableSkeleton, showNotification } from '../../../components';
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

    // Debounce blockStatus with a 1-second delay
    const debouncedBlockStatus = useDebounce(blockStatus, 1000);

    // Fetch user list from API
    useEffect(() => {
        const fetchApi = async () => {
            const res = await apiGetAllUser({ limit: 5, page: currentPage });
            if (!res?.success) return;
            const data = res.data;
            // Check data before updating state
            if (data && Array.isArray(data.users)) {
                setUsers(data.users);
                setTotalPage(data.totalPage);
            }
        };
        fetchApi();
    }, [currentPage]);

    // Handle block/unblock after debounce
    useEffect(() => {
        if (debouncedBlockStatus) {
            const { id, isBlocked } = debouncedBlockStatus;
            const toggleBlock = async () => {
                const res = await apiToggleBlockUser(id, isBlocked);
                if (res?.success) {
                    showNotification(isBlocked ? 'Người dùng đã bị chặn' : 'Người dùng đã được mở khóa', true);
                } else {
                    showNotification(res?.message || 'Có lỗi xảy ra', false);
                }
            };
            toggleBlock();
        }
    }, [debouncedBlockStatus]);

    // Handle checkbox change for blocking/unblocking
    const handleBlock = (id: string, isBlocked: boolean) => {
        setBlockStatus({ id, isBlocked });
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user._id === id ? { ...user, user_isBlocked: isBlocked } : user
            )
        );
    };

    if (users.length === 0) return <TableSkeleton />;

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
