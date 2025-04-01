// Định nghĩa kiểu dữ liệu cho admin
export interface IAdmin {
    _id?: string;
    admin_name: string;
    admin_email: string;
    admin_type: 'admin' | 'employee';
    admin_roles: string[]; // ID của các roles
    admin_mobile: string;
    admin_avatar_url?: string;
    admin_password?: string;
    admin_isBlocked?: boolean;
}
