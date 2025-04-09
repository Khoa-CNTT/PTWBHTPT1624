import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import AgricultureOutlinedIcon from '@mui/icons-material/AgricultureOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import ProductionQuantityLimitsOutlinedIcon from '@mui/icons-material/ProductionQuantityLimitsOutlined';
import { UserCircleIcon } from '../icons';
import { PATH } from '../utils/const';

export type NavItem = {
    name: string;
    icon: React.ReactNode; // Đổi từ React.ReactNode sang React.ElementType
    path?: string;
    permission?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

export const navItems: NavItem[] = [
    {
        name: 'Tổng quan',
        icon: <BadgeOutlinedIcon />,
        path: PATH.MANAGE_DASHBOARD,
    },
    {
        icon: <ProductionQuantityLimitsOutlinedIcon />,
        name: 'Sản phẩm',
        path: PATH.MANAGE_PRODUCT,
        permission: 'product_manage',
    },
    {
        icon: <BackupTableIcon />,
        name: 'Đơn hàng',
        path: PATH.MANAGE_ORDER,
        permission: 'order_manage',
    },
    {
        icon: <BackupTableIcon />,
        name: 'Bán hàng tại quầy',
        path: PATH.MANAGE_OFFLINE_ORDER,
        subItems: [
            { name: 'Tạo hóa đơn', path: PATH.MANAGE_OFFLINE_ORDER },
            { name: 'Danh sách hóa đơn', path: PATH.MANAGE_LIST_OFFLINE_ORDER },
        ],
        permission: 'offline_order',
    },
    {
        icon: <AutoStoriesOutlinedIcon />,
        name: 'Banner',
        path: PATH.MANAGE_BANNER,
        permission: 'banner_manage',
    },
    {
        icon: <CategoryOutlinedIcon />,
        name: 'Danh mục',
        path: PATH.MANAGE_CATEGORY,
        permission: 'category_manage',
    },
    {
        icon: <AutoAwesomeOutlinedIcon />,
        name: 'Thương hiệu',
        path: PATH.MANAGE_BRAND,
        permission: 'brand_manage',
    },
    {
        icon: <WarehouseOutlinedIcon />,
        name: 'Nhà cung cấp',
        path: PATH.MANAGE_SUPPLIERS,
        permission: 'supplier_manage',
    },
    {
        icon: <AgricultureOutlinedIcon />,
        name: 'Công ty vận chuyển',
        path: PATH.MANAGE_SHIPPING,
        permission: 'shipping_company_manage',
    },
    {
        icon: <RedeemOutlinedIcon />,
        name: 'Voucher',
        path: PATH.MANAGE_VOUCHER,
        permission: 'voucher_manage',
    },
    {
        icon: <UserCircleIcon />,
        name: 'Người dùng',
        path: PATH.MANAGE_USER,
        permission: 'voucher_manage',
    },
    {
        name: 'Nhân viên',
        icon: <BadgeOutlinedIcon />,
        subItems: [
            { name: 'Danh sách nhân viên', path: PATH.MANAGE_EMPLOYEE },
            { name: 'Quản lý vai trò', path: PATH.MANAGE_ROLE },
        ],
        permission: 'employee_manage',
    },
    {
        icon: <UserCircleIcon />,
        name: 'Đánh giá',
        path: PATH.MANAGE_REVIEW,
        permission: 'review_manage',
    },
    {
        icon: <UserCircleIcon />,
        name: 'Nhắn tin',
        path: PATH.MANAGE_MESSAGE,
        permission: 'message_manage',
    },
];
