export interface IUserProfile {
    _id: string;
    user_name: string;
    user_email: string;
    user_address?: string;
    user_mobile?: string;
    user_avatar_url?: string;
    user_isBlocked?: boolean;
}
export interface IUserDetail extends IUserProfile {
    user_reward_points: number;
    user_passwordChangedAt?: Date;
    createdAt: string;
}
