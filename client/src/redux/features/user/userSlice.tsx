import { createSlice, PayloadAction } from "@reduxjs/toolkit"; 
import { IIUserDetail } from "../../../interfaces/user.interfaces";

const LOCAL_STORAGE_KEY = "userDetail";

const loadUserFromLocalStorage = (): IIUserDetail => {
    const savedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : {
        _id: "",
        user_name: "",
        user_email: "",
        user_type: "user",
        user_reward_points: 0,
        user_roles: [],
        user_address: "",
        user_mobile: "",
        user_avatar_url: "",
        user_isBlocked: false,
        createdAt: "",
    };
};

const initialState: IIUserDetail = loadUserFromLocalStorage();

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setDetailUser: (state, action: PayloadAction<IIUserDetail>) => {
            const newState = { ...state, ...action.payload };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
            return newState;
        },
        setUserRewardPoints: (state, action: PayloadAction<number>) => {
            state.user_reward_points = action.payload;
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
        },
    },
});

export const { setDetailUser, setUserRewardPoints } = userSlice.actions;
export default userSlice.reducer;
