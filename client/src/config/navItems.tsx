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
    },
    {
        icon: <BackupTableIcon />,
        name: 'Đơn hàng',
        path: PATH.MANAGE_ORDER,
    },
    {
        icon: <AutoStoriesOutlinedIcon />,
        name: 'Banner',
        path: PATH.MANAGE_BANNER,
    },
    {
        icon: <CategoryOutlinedIcon />,
        name: 'Danh mục',
        path: PATH.MANAGE_CATEGORY,
    },
    {
        icon: <AutoAwesomeOutlinedIcon />,
        name: 'Thương hiệu',
        path: PATH.MANAGE_BRAND,
    },
    {
        icon: <WarehouseOutlinedIcon />,
        name: 'Nhà cung cấp',
        path: PATH.MANAGE_SUPPLIERS,
    },
    {
        icon: <AgricultureOutlinedIcon />,
        name: 'Công ty vận chuyển',
        path: PATH.MANAGE_SHIPPING,
    },
    {
        icon: <RedeemOutlinedIcon />,
        name: 'Voucher',
        path: PATH.MANAGE_VOUCHER,
    },
    {
        icon: <UserCircleIcon />,
        name: 'Người dùng',
        path: PATH.MANAGE_USER,
    },
    {
        name: 'Nhân viên',
        icon: <BadgeOutlinedIcon />,
        subItems: [
            { name: 'Danh sách nhân viên', path: PATH.MANAGE_EMPLOYEE },
            { name: 'Quản lý vai trò', path: PATH.MANAGE_ROLE },
        ],
    },
];
