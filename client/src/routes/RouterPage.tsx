import { Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from '../layout/system/AppLayout';
import CategoryManage from '../pages/system/category';
import useFetchDetailUser from '../hooks/useFetchDetailUser';
import ProtectedRoute from '../middleware/ProtectedRoute';
import DefaultLayout from '../layout/user/DefaultLayout';
import { PATH } from '../utils/const';
import BrandManage from '../pages/system/brand';
import HomePage from '../pages/user/HomePage';
import BannerManage from '../pages/system/banner';

const RouterPage = () => {
    useFetchDetailUser();

    return (
        <>
            <Routes>
                {/* ============= USER =================== */}
                <Route path={PATH.HOME} element={  
                    <ProtectedRoute allowedRoles={["user"]} redirectPath={PATH.SYSTEM}>
                        <DefaultLayout />
                    </ProtectedRoute>
                }>
                    <Route path="*" element={<Navigate to={PATH.HOME} />} />
                    <Route path={PATH.HOME} element={<HomePage />} />
                </Route>

                {/* ============= ADMIN =================== */}
                <Route path={PATH.SYSTEM} element={
                    <ProtectedRoute allowedRoles={["admin",'employee']} redirectPath={PATH.SYSTEM}>
                        <AppLayout />
                    </ProtectedRoute>
                }>
                    <Route path={PATH.MANAGE_CATEGORY} element={<CategoryManage />} />
                    <Route path={PATH.MANAGE_BRAND} element={<BrandManage />} />
                    <Route path={PATH.MANAGE_BANNER} element={<BannerManage />} />
                </Route>
            </Routes>
        </>
    );
};

export default RouterPage;
