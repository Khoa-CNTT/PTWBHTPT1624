/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { IUserDetail } from '../interfaces/user.interfaces';

// Trạng thái & hành động của store
interface UserState {
    user: IUserDetail;
    setUser: (user: IUserDetail) => void;
    addRewardPoints: (points?: number) => void;
    subtractRewardPoints: (points?: number) => void;
    addTicket: (tickets?: number) => void;
    subtractTicket: (tickets?: number) => void;
    setUserRewardPoints: (points: number) => void;
}

// Hàm lấy user từ localStorage
const getStoredUser = (): IUserDetail => {
    try {
        const stored = localStorage.getItem('user');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (err) {
        console.error('Lỗi khi parse localStorage:', err);
    }

    return {
        _id: '',
        user_name: '',
        user_email: '',
        user_spin_turns: 0,
        user_reward_points: 0,
        createdAt: '',
    };
};

// Tạo Zustand store
const useUserStore = create<UserState>((set, get) => ({
    user: getStoredUser(),

    setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
    },

    addRewardPoints: (points = 5000) => {
        const { user } = get();
        const updated = {
            ...user,
            user_reward_points: (user.user_reward_points || 0) + points,
        };
        localStorage.setItem('user', JSON.stringify(updated));
        set({ user: updated });
    },

    subtractRewardPoints: (points = 5000) => {
        const { user } = get();
        const newPoints = Math.max((user.user_reward_points || 0) - points, 0);
        const updated = { ...user, user_reward_points: newPoints };
        localStorage.setItem('user', JSON.stringify(updated));
        set({ user: updated });
    },

    addTicket: (tickets = 1) => {
        const { user } = get();
        const updated = {
            ...user,
            user_spin_turns: (user.user_spin_turns || 0) + tickets,
        };
        localStorage.setItem('user', JSON.stringify(updated));
        set({ user: updated });
    },
    subtractTicket: (tickets = 1) => {
        const { user } = get();
        const updated = {
            ...user,
            user_spin_turns: (user.user_spin_turns || 0) - tickets,
        };
        localStorage.setItem('user', JSON.stringify(updated));
        set({ user: updated });
    },

    setUserRewardPoints: (points) => {
        const { user } = get();
        const updated = { ...user, user_reward_points: points };
        localStorage.setItem('user', JSON.stringify(updated));
        set({ user: updated });
    },
}));

export default useUserStore;
