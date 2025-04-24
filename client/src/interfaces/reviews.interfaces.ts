import { IUserProfile } from './user.interfaces';

export interface IReviews {
    _id: string;
    review_rating: number;
    review_user: IUserProfile;
    review_comment: string;
    review_images: string[];
    review_likes: string[];
    review_productId: string;
    isApproved: boolean; // Mặc định chưa duyệt
}
