/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { IAdmin } from '../interfaces/admin.interfaces';

// Trạng thái & hành động của store
interface AdminState {
    admin: IAdmin | any;
    setAdmin: (admin: IAdmin) => void;
    clearAdmin: () => void;
}

// Lấy dữ liệu từ localStorage
const getStoredAdmin = (): IAdmin | any => {
    const storedAdmin = localStorage.getItem('admin');
    return storedAdmin ? JSON.parse(storedAdmin) : null;
};

// Tạo Zustand store với localStorage
const useAdminStore = create<AdminState>((set) => ({
    admin: getStoredAdmin(),
    setAdmin: (admin) => {
        localStorage.setItem('admin', JSON.stringify(admin));
        set({ admin });
    },
    clearAdmin: () => {
        localStorage.removeItem('admin');
        set({ admin: null });
    },
}));

export default useAdminStore;
