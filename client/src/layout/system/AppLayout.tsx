import { Outlet } from 'react-router';
import AppHeader from './AppHeader';
import Backdrop from './Backdrop';
import AppSidebar from './AppSidebar';
import { SidebarProvider, useSidebar } from '../../context/SidebarContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import useFetchDetailAdmin from '../../hooks/useFetchDetailAdmin';
import Loading from '../../components/common/Loading';
const LayoutContent: React.FC = () => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();
    useFetchDetailAdmin();
    const toastContainer = (
        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
    );
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
                    <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
                        <Outlet />
                    </div>
                </div>
            </div>
            {toastContainer}
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
