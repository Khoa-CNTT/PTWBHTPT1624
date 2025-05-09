/* eslint-disable @typescript-eslint/no-explicit-any */
export interface INotification {
    _id?: string;
    notification_user?: string;
    notification_title: string;
    notification_subtitle: string;
    notification_imageUrl: string;
    notification_link: string;
    notification_isWatched?: boolean;
    notification_type?: string;
    createdAt?: string;
}
