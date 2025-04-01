import { adminClient} from '../config/httpRequest';
 
// Đăng nhập người dùng
const apiLoginAdmin = async ({ email, password }: { email: string; password: string }) => {
    try {
      const res = await adminClient.post('/v1/api/admin/auth/login', { email, password });
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  };
  

 
 
// Đăng xuất người dùng
const apiLogoutAdmin = async () => {
    try {
        const res = await adminClient.post('/v1/api/admin/auth/logout');
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

// Lấy refresh token
const apiRefreshTokenAdmin = async () => {
    try {
        const res = await adminClient.post('/v1/api/admin/auth/refreshToken', { withCredentials: true });
        return res.data;
    } catch (error) {
        return {
            success: false,
            message: error,
        };
    }
};

 

export {
    apiRefreshTokenAdmin,
    apiLoginAdmin,
    apiLogoutAdmin
};
