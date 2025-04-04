import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import PhonePausedIcon from '@mui/icons-material/PhonePaused';
import DoneAllIcon from '@mui/icons-material/DoneAll'; // Thêm icon nếu muốn khác biệt
import LocalShippingIcon from '@mui/icons-material/LocalShipping'; // Cho confirm
import { IOrder } from '../interfaces/order.interfaces';

export const statusOrder = (order: IOrder) => {
    switch (order.order_status) {
        case 'pending':
            return {
                title: 'Đang chờ xác nhận',
                icon: <PhonePausedIcon style={{ fontSize: '15px', color: 'rgb(255, 165, 0)' }} />, // Màu cam
            };
        case 'confirm':
            return {
                title: 'Đợi vận chuyển',
                icon: <LocalShippingIcon style={{ fontSize: '15px', color: 'rgb(30, 144, 255)' }} />, // Màu xanh dương
            };
        case 'shipped':
            return {
                title: 'Đang giao hàng',
                icon: <DeliveryDiningIcon style={{ fontSize: '15px', color: 'rgb(0, 123, 255)' }} />,
            };
        case 'delivered':
            return {
                title: 'Giao hàng thành công',
                icon: <CheckIcon style={{ fontSize: '15px', color: 'rgb(0 136 72)' }} />,
            };
        case 'cancelled':
            return {
                title: 'Đã hủy',
                icon: <CancelIcon style={{ fontSize: '15px', color: 'rgb(255, 0, 0)' }} />,
            };
        default:
            return {
                title: 'Không rõ trạng thái',
                icon: <DoneAllIcon style={{ fontSize: '15px', color: '#ccc' }} />,
            };
    }
};
