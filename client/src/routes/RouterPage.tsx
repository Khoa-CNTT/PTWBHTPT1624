import { Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from '../layout/system/AppLayout';
import CategoryManage from '../pages/system/category';
import ProtectedRoute from '../middleware/ProtectedRoute';
import DefaultLayout from '../layout/user/DefaultLayout';
import { PATH } from '../utils/const';
import useAuthStore from '../store/authStore';
import { AdminLogin, BannerManage, BrandManage } from '../pages/system';
import HomePage from '../pages/user/HomePage';

const RouterPage = () => {
    const { isAdminLoggedIn } = useAuthStore();
    return (
        <>
            <Routes>
                {/* ============= USER =================== */}
                <Route path={PATH.HOME} element={<DefaultLayout />}>
                    <Route path="*" element={<Navigate to={PATH.HOME} />} />
                    <Route path={PATH.HOME} element={<HomePage />} />
                </Route>

                {/* ============= ADMIN =================== */}
                <Route
                    path={PATH.ADMIN_DASHBOARD}
                    element={
                        <ProtectedRoute redirectPath={PATH.ADMIN_LOGIN}>
                            <AppLayout />
                        </ProtectedRoute>
                    }>
                    <Route path={PATH.MANAGE_CATEGORY} element={<CategoryManage />} />
                    <Route path={PATH.MANAGE_BRAND} element={<BrandManage />} />
                    <Route path={PATH.MANAGE_BANNER} element={<BannerManage />} />
                </Route>
                <Route path={PATH.ADMIN_LOGIN} element={isAdminLoggedIn ? <Navigate to={PATH.ADMIN_DASHBOARD} /> : <AdminLogin />} />
            </Routes>
        </>
    );
};

export default RouterPage;
