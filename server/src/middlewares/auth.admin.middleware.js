const asyncHandle = require('../helper/asyncHandle');
const adminModel = require('../models/admin.model');
const verifyAccessToken = require('../utils/auth/verifyAccessToken');

const adminAuthentication = asyncHandle(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(301).json({
            success: false,
            message: 'Yêu cầu xác thực',
        });
    }
    const token = authHeader.split(' ')[1];
    const decodedToken = verifyAccessToken(token);
    if (!decodedToken) {
        return res.status(301).json({
            success: false,
            message: 'Token không hợp lệ',
        });
    }
    const admin = await adminModel.findById(decodedToken._id).populate({
        path: 'admin_roles',
        select: 'role_name role_permissions',
    });
    if (!admin) {
        return res.status(301).json({
            success: false,
            message: 'Token truy cập không hợp lệ',
        });
    }
    req.admin = admin;
    next();
});

const restrictTo = (requiredPermission) =>
    asyncHandle(async (req, res, next) => {
        const { admin } = req;
        // ✅ Nếu là admin, cho phép truy cập
        if (admin.admin_type === 'admin') {
            return next();
        }

        // 🚫 Nếu không có vai trò hoặc quyền nào, chặn truy cập
        if (!admin.admin_roles || admin.admin_roles.length === 0) {
            return res.status(403).json({
                success: false,
                message: 'Không có quyền truy cập',
            });
        }
        // 🔍 Kiểm tra quyền trong danh sách quyền của vai trò
        const adminPermissions = admin.admin_roles.flatMap((role) => role.role_permissions);
        if (!adminPermissions.includes(requiredPermission)) {
            return res.status(403).json({
                success: false,
                message: `Bạn cần quyền "${requiredPermission}" để thực hiện hành động này`,
            });
        }

        next();
    });

module.exports = { adminAuthentication, restrictTo };
