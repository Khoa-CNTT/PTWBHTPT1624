export const PATH = {
    HOME: '/',
    DETAIL_PRODUCT: '/:slug/:pid',
    PAGE_CATEGORY: '/danh-muc/:category_slug/:cid',
    PAGE_LIST_CATEGORY: 'danh-sach-danh-muc',
    PAGE_BRAND: '/thuong-hieu/:brand_slug',
    PAGE_SEARCH: '/tim-kiem/:title',
    PAGE_USER: '/nguoi-dung/tai-khoan',
    PAGE_CART: '/gio-hang',
    PAGE_PAYMENT: '/payment',
    PAGE_PAYPAL: '/payment/paypal',
    FORGET_PASSWORD: '/reset_password/:token',
    MESSAGE: 'message',
    // =========== ADMIN ==============
    ADMIN_DASHBOARD: '/quan-ly',
    ADMIN_LOGIN: '/dang-nhap',
    MANAGE_CATEGORY: '/quan-ly/danh-muc',
    MANAGE_BRAND: '/quan-ly/thuong-hieu',
    MANAGE_BANNER: '/quan-ly/banner',
    MANAGE_SUPPLIERS: '/quan-ly/nha-cung-cap',
    MANAGE_STATISTICAL: '/thong-ke-doanh-thu',
    MANAGE_VOUCHER: '/quan-ly/voucher',
    MANAGE_USER: '/quan-ly/nguoi-dung',
    MANAGE_SHIPPING: '/quan-ly/cong-ty-van-chuyen',
    MANAGE_ROLE: '/quan-ly/vai-tro',
    MANAGE_EMPLOYEE: '/quan-ly/nhan-vien',
};

export const SEARCH_UTILITY = [
    {
        id: 1,
        image: danhchoban,
        title: 'Dành cho bạn',
    },
    {
        id: 2,
        image: bachhoa,
        title: 'Bách hóa dưới 99k',
    },
    {
        id: 3,
        image: dealsieuhot,
        title: 'Siêu hot',
    },
    {
        id: 4,
        image: hangmoi,
        title: 'Hàng mới',
    },
    {
        id: 5,
        image: revodoi,
        title: 'Rẽ vô đối',
    },
];

export const RATING_REVIEW = [
    { start: 1, text: 'Rất tệ' },
    { start: 2, text: 'Tệ ' },
    { start: 3, text: 'Bình thường' },
    { start: 4, text: 'Tốt ' },
    { start: 5, text: 'Rất tốt' },
];

export const SORT_BAR = [
    {
        id: 0,
        label: 'tất cả',
        sortBy: {
            sort: '',
        },
    },
    {
        id: 1,
        label: 'Phổ biến',
        sortBy: {
            sort: '-star',
        },
    },
    {
        id: 2,
        label: 'Bán chạy',
        sortBy: {
            sort: '-sold',
        },
    },
    {
        id: 3,
        label: 'Giá thấp đến cao',
        sortBy: {
            sort: 'new_price',
        },
    },
    {
        id: 4,
        label: 'Giá cao đến thấp',
        sortBy: {
            sort: '-new_price',
        },
    },
];

import PersonIcon from '@mui/icons-material/Person';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import SellIcon from '@mui/icons-material/Sell';
import { bachhoa, danhchoban, dealsieuhot, hangmoi, imgPayInCash, paypal, revodoi } from '../assets';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';

export const SIDEBAR_USER = [
    {
        label: 'Thông tin tài khoản',
        path_name: 'profile',
        icon: <PersonIcon fontSize="medium" style={{ color: 'rgb(155,155,155)' }} />,
    },
    {
        label: 'Đơn mua',
        path_name: 'purchase',
        icon: <ShoppingBasketIcon fontSize="medium" style={{ color: 'rgb(155,155,155)' }} />,
    },
    {
        label: 'Quản lý bán hàng',
        path_name: 'sell',
        icon: <SellIcon fontSize="medium" style={{ color: 'rgb(155,155,155)' }} />,
    },
    {
        label: 'Quản lý sản phẩm',
        path_name: 'product',
        icon: <ProductionQuantityLimitsIcon fontSize="medium" style={{ color: 'rgb(155,155,155)' }} />,
    },
];

export const PAYMENT_METHOD = {
    title: 'Chọn hình thức thanh toán',
    method: [
        {
            code: 'CASH',
            label: 'Thanh toán tiền mặt khi nhận hàng',
            img: imgPayInCash,
        },
        {
            code: 'PAYPAL',
            label: 'Thanh toán bằng PAYPAL',
            img: paypal,
        },
    ],
};
export const DELIVERY_METHOD = {
    title: 'Chọn hình thức giao hàng',
    method: [
        {
            code: 'FAST',
            label: 'Giao tiết kiệm',
        },
        {
            code: 'NOW',
            label: 'Giao siêu tốc',
        },
    ],
};

export const SELL_TAB = [
    {
        tab: 1,
        title: 'Tất cả',
    },
    {
        tab: 2,
        title: 'Chờ xác nhận',
    },
    {
        tab: 3,
        title: 'Vận Chuyển',
    },
    {
        tab: 4,
        title: 'Đã giao hàng',
    },
    {
        tab: 5,
        title: 'Thành công',
    },
    {
        tab: 6,
        title: 'Đã hủy',
    },
];

export const BOTTOM_NAVIGATE_MOBILE = [
    {
        label: 'Trang chủ',
        logo: 'https://frontend.tikicdn.com/_mobile-next/static/img/home/navigation/home.png',
        link: PATH.HOME,
    },
    {
        label: 'Danh mục',
        logo: 'https://frontend.tikicdn.com/_mobile-next/static/img/home/navigation/cate.png',
        link: PATH.PAGE_LIST_CATEGORY,
    },
    {
        label: 'Theo dõi',
        logo: 'https://frontend.tikicdn.com/_mobile-next/static/img/home/navigation/account.png',
        link: '/follow',
    },
    {
        label: 'Chat',
        logo: 'https://salt.tikicdn.com/ts/upload/b6/cb/1d/34cbe52e6c2566c5033103c847a9d855.png',
        link: '/message',
    },
    {
        label: 'Cá nhân',
        logo: 'https://frontend.tikicdn.com/_mobile-next/static/img/home/navigation/account.png',
        link: PATH.PAGE_USER,
    },
];
