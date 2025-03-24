export interface IBanner {
    banner_title: string;
    banner_imageUrl: string;
    banner_link: string; 
    banner_startDate: Date ; // Kiểu Date thay vì giá trị
    banner_endDate: Date ; // Kiểu Date thay vì giá trị
    banner_description: string;
    _id?: string;
  }
  