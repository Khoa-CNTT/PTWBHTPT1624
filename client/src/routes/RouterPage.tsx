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
import FilterPage from '../pages/user/filterPage';
import ForgotPassword from '../feature/forgotPassword';
import CartPage from '../pages/user/cartPage';
import UserProfile from '../pages/user/userPage/profile/UserProfile';
import VoucherPage from '../pages/user/voucherPage';
import UserPage from '../pages/user/userPage';
import FavoritePage from '../pages/user/userPage/FavoritePage';
import RecentViewPage from '../pages/user/userPage/RecentViewPage';
import PurchasedProductsPage from '../pages/user/userPage/PurchasedProductsPage';

const RouterPage = () => {
    const { isAdminLoggedIn, isUserLoggedIn } = useAuthStore();

    return (
        <Routes>
            {/* ============= USER =================== */}
            <Route path={PATH.HOME} element={<DefaultLayout />}>
                <Route index element={<HomePage />} />
                <Route path={PATH.DETAIL_PRODUCT} element={<DetailPage />} />
                <Route path={PATH.PAGE_SEARCH} element={<SearchPage />} />
                <Route path={PATH.PAGE_IMAGE_SEARCH} element={<SearchPage />} />
                <Route path={PATH.PAGE_CATEGORY} element={<FilterPage />} />
                <Route path={PATH.PAGE_BRAND} element={<FilterPage />} />
                <Route path={PATH.PAGE_CART} element={<CartPage />} />
                <Route path={PATH.FORGET_PASSWORD} element={<ForgotPassword />} />
                <Route path={PATH.VOUCHER} element={<VoucherPage />} />

                {/* Các trang bên dưới vẫn được bọc trong DefaultLayout */}
                <Route path="*" element={<Navigate to={PATH.HOME} />} />

                <Route path={PATH.PAGE_USER} element={isUserLoggedIn ? <UserPage /> : <Navigate to="/" />}>
                    <Route path={''} element={<Navigate to="profile" />} />
                    <Route path={'profile'} element={<UserProfile />} />
                    <Route path={'san-pham-yeu-thich'} element={<FavoritePage />} />
                    <Route path={'san-pham-da-xem'} element={<RecentViewPage />} />
                    <Route path={'san-pham-da-mua'} element={<PurchasedProductsPage />} />
                    {/* <Route path={'purchase'} element={<PurchaseManage />} />
                    <Route path={'sell'} element={<SellManage />} />
                    <Route path={'product'} element={<ProductManage />} />
                    <Route path={'view/:oid'} element={<ViewOrder />} /> */}
                </Route>
            </Route>

            {/* Đặc biệt: không bọc UserProfile trong DefaultLayout */}

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
