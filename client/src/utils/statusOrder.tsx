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

export const statusOrderNotification = (orderStatus: string) => {
    switch (orderStatus) {
        case 'confirm':
            return {
                title: 'Đơn hàng được xác nhận! 🎉',
                subtitle: '📦 Đơn hàng của bạn đã sẵn sàng! ✅',
                message:
                    '🙌 Cảm ơn bạn đã đặt hàng! Đơn hàng của bạn đã được xác nhận và đang được đóng gói cẩn thận. 📦 Chúng tôi sẽ thông báo khi hàng được gửi đi. 🚚',
            };
        case 'shipped':
            return {
                title: 'Hàng đang trên đường! 🚚',
                subtitle: '📍 Đơn hàng của bạn đang di chuyển! ✅',
                message: '🚛 Đơn hàng của bạn đã rời kho và đang được vận chuyển nhanh chóng. 🌍 Theo dõi trạng thái để biết thời gian giao hàng dự kiến! ⏰',
            };
        case 'delivered':
            return {
                title: 'Giao hàng thành công! 🎁',
                subtitle: 'Đơn hàng đã đến tay bạn ✅',
                message: 'Cảm ơn bạn đã mua hàng! Bạn vừa nhận được 1 lượt quay may mắn 🎉 Hãy vào Vòng quay may mắn để thử vận may nhé!',
            };

        case 'cancelled':
            return {
                title: 'Đơn hàng đã bị hủy 😔',
                subtitle: '❌ Đơn hàng của bạn đã bị hủy ✅',
                message: '🚫 Rất tiếc, đơn hàng của bạn đã bị hủy. 📞 Liên hệ với chúng tôi nếu bạn cần hỗ trợ hoặc muốn đặt lại đơn hàng. 🤝',
            };
        default:
            return {
                title: 'Trạng thái không xác định ❓',
                subtitle: '⚠️ Không rõ trạng thái đơn hàng ✅',
                message: '🔍 Chúng tôi không thể xác định trạng thái đơn hàng. 📧 Vui lòng liên hệ bộ phận hỗ trợ để được giải quyết nhanh chóng. 🛠️',
            };
    }
};
