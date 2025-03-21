import { create } from "zustand";

interface AuthState {
    isUserLoggedIn: boolean;
    isAdminLoggedIn: boolean;
    loginUser: () => void;
    loginAdmin: () => void;
    logoutUser: () => void;
    logoutAdmin: () => void;
}

// Khởi tạo Zustand store
const useAuthStore = create<AuthState>((set) => ({
    isUserLoggedIn: JSON.parse(localStorage.getItem("isUserLoggedIn") || "false"),  
    isAdminLoggedIn: JSON.parse(localStorage.getItem("isAdminLoggedIn") || "false"),

    loginUser: () => {
        localStorage.setItem("isUserLoggedIn", JSON.stringify(true)); 
        set({ isUserLoggedIn: true });
    },

    loginAdmin: () => {
        localStorage.setItem("isAdminLoggedIn", JSON.stringify(true)); 
        set({ isAdminLoggedIn: true });
    },

    logoutUser: () => {
        localStorage.removeItem("isUserLoggedIn");
        set({ isUserLoggedIn: false });
    },

    logoutAdmin: () => {
        localStorage.removeItem("isAdminLoggedIn");
        set({ isAdminLoggedIn: false });
    },
}));

export default useAuthStore;
