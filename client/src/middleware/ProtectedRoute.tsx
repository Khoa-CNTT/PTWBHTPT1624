import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[]; // Danh sách các quyền được phép truy cập
  redirectPath: string; // Đường dẫn chuyển hướng nếu không có quyền
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, redirectPath }) => {
  const { user_type } = useAppSelector((state) => state.user);
  if (!allowedRoles.includes(user_type)) {
    return <Navigate to={redirectPath} />;
  }
  return <>{children}</>;
};


export default ProtectedRoute;
