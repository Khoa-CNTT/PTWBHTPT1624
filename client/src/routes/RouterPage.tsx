import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/user/HomePage';
import AppLayout from '../layout/system/AppLayout';
import Blank from '../pages/system/Blank';
import CategoryManage from '../pages/system/category';
import useFetchDetailUser from '../hooks/useFetchDetailUser';
import ProtectedRoute from '../middleware/ProtectedRoute';
import DefaultLayout from '../layout/user/DefaultLayout';
import { PATH } from '../utils/const';

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
                    <Route path="blank" element={<Blank />} />
                </Route>
            </Routes>
        </>
    );
};

export default RouterPage;
