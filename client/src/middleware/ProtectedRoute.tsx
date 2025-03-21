import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
interface ProtectedRouteProps {
  children: ReactNode;
  redirectPath: string; // Đường dẫn chuyển hướng nếu không có quyền
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectPath }) => {
  const { isAdminLoggedIn } = useAuthStore();
   
  if (!isAdminLoggedIn) {
    return <Navigate to={redirectPath} />;
  }
  return <>{children}</>;
};


export default ProtectedRoute;
