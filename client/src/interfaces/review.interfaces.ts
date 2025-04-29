interface ReviewUser {
    _id: string;
    user_name: string;
    user_avatar_url: string;
    createdAt: string;
}

export interface IReview {
    _id?: string;
    review_rating?: number;
    review_user?: ReviewUser;
    review_comment: string;
    review_images: string[];
    review_likes?: string[]; // assuming this stores user IDs who liked the review
    review_productId: string;
    isApproved?: boolean;
    createdAt?: string; // or `Date` if bạn parse thành object Date
    updatedAt?: string; // hoặc `Date`
}
