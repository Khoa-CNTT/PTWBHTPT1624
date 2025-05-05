import { BrowserRouter } from 'react-router-dom';
import RouterPage from './routes/RouterPage';
import { useEffect } from 'react';
import useSocketStore from './store/socketStore';
import useUserStore from './store/userStore';

export default function App() {
    const { socket, isConnected, connect, disconnect } = useSocketStore();
    const { user } = useUserStore();

    // Kết nối socket khi ứng dụng tải
    useEffect(() => {
        connect();
        // Ngắt kết nối khi tắt tab hoặc reload
        const handleBeforeUnload = () => {
            disconnect(); // socket.disconnect()
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    // Gửi sự kiện addUser hoặc addAdmin nếu có ID hợp lệ
    useEffect(() => {
        if (!isConnected || !socket) return;
        if (user?._id) {
            socket.emit('addUser', user._id);
        }
    }, [isConnected, user?._id, socket]);

    return (
        <BrowserRouter>
            <RouterPage />
        </BrowserRouter>
    );
}
