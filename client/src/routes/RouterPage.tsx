import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../layout/system/AppLayout';
import ProtectedRoute from '../middleware/ProtectedRoute';
import DefaultLayout from '../layout/user/DefaultLayout';
import { PATH } from '../utils/const';
import useAuthStore from '../store/authStore';
import { AdminLogin, DashboardManage } from '../pages/system';
import { ROUTES } from '../config/route';
import PermissionMiddleware from '../middleware/PermissionMiddleware';
import { NoPermission } from '../components';
import AdminProfile from '../pages/system/profile';
import HomePage from '../pages/user/HomePage';
import DetailPage from '../pages/user/detailPage';
import SearchPage from '../pages/user/searchPage';

const RouterPage = () => {
    const { isAdminLoggedIn } = useAuthStore();

    return (
        <Routes>
            {/* ============= USER =================== */}
            <Route path={PATH.HOME} element={<DefaultLayout />}>
                <Route index element={<HomePage />} />
                <Route path={PATH.DETAIL_PRODUCT} element={<DetailPage />}></Route>
                <Route path={PATH.PAGE_SEARCH} element={<SearchPage />}></Route>

                <Route path="*" element={<Navigate to={PATH.HOME} />} />
            </Route>

            {/* ============= ADMIN =================== */}
            <Route
                path={PATH.ADMIN_DASHBOARD}
                element={
                    <ProtectedRoute redirectPath={PATH.ADMIN_LOGIN}>
                        <AppLayout />
                    </ProtectedRoute>
                }>
                {/* Route mặc định */}
                <Route index element={<DashboardManage />} />
                <Route path={PATH.MANAGE_DASHBOARD} element={<DashboardManage />} />
                {/* Lặp qua các route có phân quyền */}
                {ROUTES.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={
                            <PermissionMiddleware requiredPermissions={route.permissions} redirectNode={<NoPermission />}>
                                <route.component />
                            </PermissionMiddleware>
                        }
                    />
                ))}
                {/* Nếu không khớp route nào, điều hướng về dashboard */}
                <Route path={PATH.MANAGE_PROFILE} element={<AdminProfile />} />
                <Route path="*" element={<Navigate to={PATH.MANAGE_DASHBOARD} />} />
            </Route>
            {/* Trang đăng nhập admin */}
            <Route path={PATH.ADMIN_LOGIN} element={isAdminLoggedIn ? <Navigate to={PATH.ADMIN_DASHBOARD} /> : <AdminLogin />} />
        </Routes>
    );
};

export default RouterPage;
