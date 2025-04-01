import axios from 'axios';
import { apiRefreshTokenAdmin } from '../services/auth.admin.service';
// Hàm tạo instance Axios với các cấu hình tùy chọn
const createAxiosInstance = (withAuth = false) => {
    return axios.create({
        baseURL: import.meta.env.VITE_REACT_API_URL_BACKEND || 'http://localhost:4000',
        withCredentials: withAuth, // Bật/tắt gửi cookie
    });
};
// Các instance Axios đặt tên theo thực tế
export const apiClient = createAxiosInstance(); // API chung, không cần auth
export const authClient = createAxiosInstance(true); // API yêu cầu auth (JWT)
export const adminClient = createAxiosInstance(true); // API dành riêng cho admin

adminClient.interceptors.request.use(
    function (config) {
        const access_token=localStorage.getItem("ad_token")
        if(!access_token){
             return config;
        }
        config.headers.Authorization = `Bearer ${JSON.parse(access_token)}`;
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    },
); 
// Add a request interceptor
adminClient.interceptors.response.use(
    response => response,
    async (error) => {
      const originalRequest = error.config;
      // Kiểm tra nếu lỗi là 401 (Unauthorized) và request chưa được thử lại
      if (error.response?.status === 500 && !originalRequest._retry) {
        originalRequest._retry = true; // Đánh dấu request đã thử lại
        try {
          const accessToken=localStorage.getItem('ad_token');
          if(!accessToken) return;
          const res = await apiRefreshTokenAdmin(); // Gọi API để lấy access token mới
          if (res.success) {
            // Cập nhật lại header Authorization với token mới
            originalRequest.headers['Authorization'] = `Bearer ${res.data.access_token}`;
            localStorage.setItem('ad_token', JSON.stringify(res.data.access_token));
            return adminClient(originalRequest); // Gửi lại request ban đầu với token mới
          }else{
            localStorage.clear();
          }
        } catch (error) {
          localStorage.clear();
          console.error('Failed to refresh token:', error);
        }
      }
      // Nếu không phải lỗi 401 hoặc không thể refresh token, trả về lỗi ban đầu
      return Promise.reject(error);
    }
  );
  