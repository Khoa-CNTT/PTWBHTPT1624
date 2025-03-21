import { create } from "zustand";
import { IAdmin } from "../interfaces/admin.interfaces";



// Trạng thái & hành động của store
interface AdminState {
    admin: IAdmin | null;
    setAdmin: (admin: IAdmin) => void;
    clearAdmin: () => void;
}

// Tạo Zustand store
const useAdminStore = create<AdminState>((set) => ({
    admin: null,
    setAdmin: (admin) => set({ admin }),
    clearAdmin: () => set({ admin: null }),
}));

export default useAdminStore;
