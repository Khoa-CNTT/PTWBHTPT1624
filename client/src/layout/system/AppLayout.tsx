import { Outlet } from 'react-router';
import AppHeader from './AppHeader';
import Backdrop from './Backdrop';
import AppSidebar from './AppSidebar';
import { SidebarProvider, useSidebar } from '../../context/SidebarContext';
import useFetchDetailAdmin from '../../hooks/useFetchDetailAdmin';
import Loading from '../../components/common/Loading';
import ToastComponent from '../../components/toastComponent';
import useSocketStore from '../../store/socketStore';
import useAdminStore from '../../store/adminStore';
import { useEffect } from 'react';

const LayoutContent: React.FC = () => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();
    useFetchDetailAdmin();
    const { socket, isConnected, connect } = useSocketStore();
    const { admin } = useAdminStore();

    // Kết nối socket khi ứng dụng tải
    useEffect(() => {
        if (!isConnected) connect();
    }, [isConnected, connect]);

    // Gửi sự kiện addUser hoặc addAdmin nếu có ID hợp lệ
    useEffect(() => {
        if (!isConnected || !socket) return;
        if (admin?._id) {
            socket.emit('addAdmin', admin._id);
        }
    }, [isConnected, admin?._id, socket]);

    return (
        <>
            <div className="min-h-screen xl:flex">
                <div>
                    <AppSidebar />
                    <Backdrop />
                </div>
                <div
                    className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]'} ${
                        isMobileOpen ? 'ml-0' : ''
                    }`}>
                    <AppHeader />
                    <div className="mx-auto max-w-screen-2xl p-4">
                        <Outlet />
                    </div>
                </div>
            </div>
            <ToastComponent />
            <Loading />
        </>
    );
};

const AppLayout: React.FC = () => {
    return (
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    );
};

export default AppLayout;
