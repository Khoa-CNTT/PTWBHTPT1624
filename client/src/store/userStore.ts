/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { IUserDetail } from '../interfaces/user.interfaces';

// Trạng thái & hành động của store
interface UserState {
    user: IUserDetail;
    setUser: (user: IUserDetail) => void;
    clearUser: () => void;
}

// Lấy dữ liệu từ localStorage
const getStoredUser = (): IUserDetail => {
    const storedUser = localStorage.getItem('user');
    return storedUser
        ? JSON.parse(storedUser)
        : {
              user_reward_points: 0,
              createdAt: '',
              _id: '',
              user_name: '',
              user_email: '',
          };
};

// Tạo Zustand store với localStorage
const useUserStore = create<UserState>((set) => ({
    user: getStoredUser(),
    setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
    },
    clearUser: () => {
        localStorage.removeItem('user');
        set({
            user: {
                user_reward_points: 0,
                createdAt: '',
                _id: '',
                user_name: '',
                user_email: '',
            },
        });
    },
}));

export default useUserStore;
