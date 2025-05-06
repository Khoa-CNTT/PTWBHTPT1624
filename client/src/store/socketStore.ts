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
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000, // 2 giây giữa mỗi lần reconnect
    reconnectionDelayMax: 5000,
    timeout: 20000,
});
// Định nghĩa kiểu cho mảng userOnline (giống như trong socketStore)

// Khởi tạo và cấu hình store
const useSocketStore = create<SocketStore>((set, get) => ({
    socket,
    isConnected: false,
    connect: () => {
        const currentSocket = get().socket;
        if (!get().isConnected) {
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
