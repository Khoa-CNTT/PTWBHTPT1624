/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { ENV } from '../config/ENV';
import io from 'socket.io-client';

// ✅ Kiểu dữ liệu cho store Zustand
interface SocketStore {
    socket: any;
    isConnected: boolean;
    connect: () => void;
    disconnect: () => void;
}

// ⚡ Tạo một instance duy nhất của socket
const URL = ENV.API_URL_BACKEND_SOCKET;
const socket: any = io(URL, {
    autoConnect: false, // 👉 Ngăn tự động kết nối khi khởi tạo
});
// Định nghĩa kiểu cho mảng userOnline (giống như trong socketStore)

// Khởi tạo và cấu hình store
const useSocketStore = create<SocketStore>((set, get) => ({
    socket,
    isConnected: false,
    connect: () => {
        const currentSocket = get().socket;
        if (!get().isConnected) {
            console.log('sdsdsdssdsdsdsd');
            currentSocket.connect();
            currentSocket.on('connect', () => {
                set({ isConnected: true });
                console.log('⚡ Socket connected:', currentSocket.id);
            });
        }
    },

    disconnect: () => {
        const currentSocket = get().socket;
        if (get().isConnected) {
            currentSocket.disconnect();
            set({ isConnected: false });
            console.log('🔌 Socket disconnected');
        }
    },
}));

export default useSocketStore;
