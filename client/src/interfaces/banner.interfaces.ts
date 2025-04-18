/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IBanner {
    banner_title: string;
    banner_imageUrl: string;
    banner_link: string;
    banner_startDate: Date | any; // Kiểu Date thay vì giá trị
    banner_endDate: Date | any; // Kiểu Date thay vì giá trị
    banner_description: string;
    _id?: string;
}
