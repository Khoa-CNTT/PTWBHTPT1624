export const PATH = {
    HOME: '/',
    DETAIL_PRODUCT: '/:slug/:pid',
    PAGE_CATEGORY: '/danh-muc/:category_slug/:category_code',
    PAGE_LIST_CATEGORY: 'danh-sach-danh-muc',
    PAGE_BRAND: '/thuong-hieu/:brand_slug',
    PAGE_SEARCH: '/tim-kiem/:keySearch',
    PAGE_IMAGE_SEARCH: '/tim-kiem-hinh-anh',
    PAGE_CART: '/gio-hang',
    PAGE_PAYMENT: '/payment',
    PAGE_PAYPAL: '/payment/paypal',
    VOUCHER: '/voucher',
    FORGET_PASSWORD: '/reset_password/:token',
    MESSAGE: 'message',
    PAGE_USER: '/nguoi-dung',
    PAGE_ORDER: '/nguoi-dung/don-hang',
    PAGE_PROFILE: '/nguoi-dung/thong-tin-tai-khoan',
    PAGE_FAVORITE: '/nguoi-dung/san-pham-yeu-thich',
    PAGE_RECENT_VIEW: '/nguoi-dung/da-xem-gan-day',
    PAGE_PURCHASED: '/nguoi-dung/san-pham-da-mua',
    PAGE_USER_VOUCHER: '/nguoi-dung/voucher-cua-ban',
    // =========== ADMIN ==============
    ADMIN_DASHBOARD: '/quan-ly',
    MANAGE_DASHBOARD: '/quan-ly/dashboard',
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
    MANAGE_PRODUCT: '/quan-ly/san-pham',
    MANAGE_ORDER: '/quan-ly/don-hang',
    MANAGE_OFFLINE_ORDER: '/quan-ly/tao-hoa-don',
    MANAGE_LIST_OFFLINE_ORDER: '/quan-ly/hoa-don',
    ORDER_DETAIL: '/quan-ly/don-hang-chi-tiet/:oid',
    MANAGE_PROFILE: '/quan-ly/chinh-sua-thong-tin',
    MANAGE_REVIEW: '/quan-ly/danh-gia',
    MANAGE_MESSAGE: '/quan-ly/nhan-tin',
};

export const SEARCH_UTILITY = [
    {
        id: 0,
        image: danhchoban,
        title: 'Dành cho bạn',
    },
    {
        id: 1,
        image: hangmoi,
        title: 'Hàng mới',
    },
    {
        id: 2,
        image: bachhoa,
        title: 'Dưới 99k',
    },
    {
        id: 3,
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
            sort: '-product_ratings',
        },
    },
    {
        id: 2,
        label: 'Bán chạy',
        sortBy: {
            sort: '-product_sold',
        },
    },
    {
        id: 3,
        label: 'Giá thấp đến cao',
        sortBy: {
            sort: 'product_discounted_price',
        },
    },
    {
        id: 4,
        label: 'Giá cao đến thấp',
        sortBy: {
            sort: '-product_discounted_price',
        },
    },
];

import PersonIcon from '@mui/icons-material/Person';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import SellIcon from '@mui/icons-material/Sell';
import { bachhoa, danhchoban, hangmoi, imgPayInCash, paypal, revodoi } from '../assets';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ScheduleIcon from '@mui/icons-material/Schedule';
export const SIDEBAR_USER = [
    {
        label: 'Thông tin tài khoản',
        path_name: PATH.PAGE_PROFILE,
        icon: <PersonIcon fontSize="medium" style={{ color: 'rgb(155,155,155)' }} />,
    },
    {
        label: 'Danh sách đơn hàng',
        path_name: PATH.PAGE_ORDER,
        icon: <ShoppingBasketIcon fontSize="medium" style={{ color: 'rgb(155,155,155)' }} />,
    },
    {
        label: 'Sản phẩm đã mua',
        path_name: PATH.PAGE_PURCHASED,
        icon: <SellIcon fontSize="medium" style={{ color: 'rgb(155,155,155)' }} />,
    },
    {
        label: 'Sản phẩm yêu thích',
        path_name: PATH.PAGE_FAVORITE,
        icon: <FavoriteBorderIcon fontSize="medium" style={{ color: 'rgb(155,155,155)' }} />,
    },
    {
        label: 'Đã xem gần đây',
        path_name: PATH.PAGE_RECENT_VIEW,
        icon: <ScheduleIcon fontSize="medium" style={{ color: 'rgb(155,155,155)' }} />,
    },
    {
        label: 'Voucher của bạn',
        path_name: PATH.PAGE_USER_VOUCHER,
        icon: <ScheduleIcon fontSize="medium" style={{ color: 'rgb(155,155,155)' }} />,
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
