import { Routes, Route, Navigate } from 'react-router-dom';

import AppLayout from '../layout/system/AppLayout';
import CategoryManage from '../pages/system/category';
import ProtectedRoute from '../middleware/ProtectedRoute';
import DefaultLayout from '../layout/user/DefaultLayout';
import { PATH } from '../utils/const';
import useAuthStore from '../store/authStore';
import {
    AdminLogin,
    BannerManage,
    BrandManage,
    EmployeeManage,
    ProductManage,
    RoleManage,
    ShippingManage,
    SupplierManage,
    UserManage,
    VoucherManage,
    DashboardManage,
} from '../pages/system';
import HomePage from '../pages/user/HomePage';
import OrderManage from '../pages/system/order';
import OrderDetail from '../pages/system/order/OrderDetail';

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
                    <Route path={''} element={<DashboardManage />} />
                    <Route path={PATH.MANAGE_DASHBOARD} element={<DashboardManage />} />
                    <Route path={PATH.MANAGE_CATEGORY} element={<CategoryManage />} />
                    <Route path={PATH.MANAGE_BRAND} element={<BrandManage />} />
                    <Route path={PATH.MANAGE_BANNER} element={<BannerManage />} />
                    <Route path={PATH.MANAGE_SUPPLIERS} element={<SupplierManage />} />
                    <Route path={PATH.MANAGE_VOUCHER} element={<VoucherManage />} />
                    <Route path={PATH.MANAGE_SHIPPING} element={<ShippingManage />} />
                    <Route path={PATH.MANAGE_USER} element={<UserManage />} />
                    <Route path={PATH.MANAGE_ROLE} element={<RoleManage />} />
                    <Route path={PATH.MANAGE_EMPLOYEE} element={<EmployeeManage />} />
                    <Route path={PATH.MANAGE_PRODUCT} element={<ProductManage />} />
                    <Route path={PATH.MANAGE_ORDER} element={<OrderManage />} />
                    <Route path={PATH.ORDER_DETAIL} element={<OrderDetail />} />
                </Route>
                <Route path={PATH.ADMIN_LOGIN} element={isAdminLoggedIn ? <Navigate to={PATH.ADMIN_DASHBOARD} /> : <AdminLogin />} />
            </Routes>
        </>
    );
};

export default RouterPage;
