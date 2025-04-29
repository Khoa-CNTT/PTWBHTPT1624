/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { IUserDetail } from '../interfaces/user.interfaces';

// Trạng thái & hành động của store
interface UserState {
    user: IUserDetail;
    setUser: (user: IUserDetail) => void;
    clearUser: () => void;
    addRewardPoints: (points?: number) => void;
    subtractRewardPoints: (points?: number) => void; // Trừ điểm
    setUserRewardPoints: (points: number) => void; // Cập nhật điểm
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
const useUserStore = create<UserState>((set, get) => ({
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
    addRewardPoints: (points: number = 5000) => {
        const currentUser = get().user;
        const updatedUser = {
            ...currentUser,
            user_reward_points: currentUser.user_reward_points + points,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
    },
    subtractRewardPoints: (points: number = 5000) => {
        const currentUser = get().user;
        const newPoints = Math.max(currentUser.user_reward_points - points, 0);
        const updatedUser = {
            ...currentUser,
            user_reward_points: newPoints,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
    },
    setUserRewardPoints: (points: number) => { // Thêm hành động cập nhật điểm
        const currentUser = get().user;
        const updatedUser = {
            ...currentUser,
            user_reward_points: points,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
    }
}));

export default useUserStore;
