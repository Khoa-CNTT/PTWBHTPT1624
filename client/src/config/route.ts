import {
    BannerManage,
    BrandManage,
    CategoryManage,
    EmployeeManage,
    OrderManage,
    ProductManage,
    RoleManage,
    ShippingManage,
    SupplierManage,
    UserManage,
    VoucherManage,
} from '../pages/system';
import OrderDetail from '../pages/system/order/OrderDetail';
import { PATH } from '../utils/const';

export const ROUTES = [
    { path: PATH.MANAGE_CATEGORY, component: CategoryManage, permissions: 'category_manage' },
    { path: PATH.MANAGE_ORDER, component: OrderManage, permissions: 'order_manage' },
    { path: PATH.MANAGE_USER, component: UserManage, permissions: 'user_manage' },
    { path: PATH.MANAGE_ROLE, component: RoleManage, permissions: 'role_manage' },
    { path: PATH.MANAGE_PRODUCT, component: ProductManage, permissions: 'product_manage' },
    { path: PATH.MANAGE_BANNER, component: BannerManage, permissions: 'banner_manage' },
    { path: PATH.MANAGE_SUPPLIERS, component: SupplierManage, permissions: 'supplier_manage' },
    { path: PATH.MANAGE_VOUCHER, component: VoucherManage, permissions: 'voucher_manage' },
    { path: PATH.MANAGE_SHIPPING, component: ShippingManage, permissions: 'shipping_company_manage' },
    { path: PATH.MANAGE_EMPLOYEE, component: EmployeeManage, permissions: 'employee_manage' },
    { path: PATH.MANAGE_BRAND, component: BrandManage, permissions: 'brand_manage' },
    { path: PATH.ORDER_DETAIL, component: OrderDetail, permissions: 'order_manage' },
    // { path: PATH.MESSAGE_MANAGE, component: OrderDetail, permissions: 'order_manage' },
];
