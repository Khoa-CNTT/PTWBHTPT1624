import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { PATH } from '../../utils/const';

const NoPermission: React.FC = () => {
    return (
        <div className="flex items-center justify-center  from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 px-4">
            <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-10 max-w-lg w-full text-center animate-fade-in">
                <div className="flex justify-center mb-6">
                    <AlertTriangle className="h-16 w-16 text-yellow-500 animate-pulse" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">Không có quyền truy cập</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Bạn không có quyền truy cập vào trang này. Nếu bạn cho rằng đây là lỗi, hãy liên hệ quản trị viên.
                </p>
                <Link
                    to={PATH.MANAGE_DASHBOARD}
                    className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition duration-300">
                    Quay về trang chính
                </Link>
            </div>
        </div>
    );
};

export default NoPermission;
