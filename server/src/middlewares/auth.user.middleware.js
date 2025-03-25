const asyncHandle = require("../helper/asyncHandle");
const userModel = require("../models/user.model.js");
const verifyAccessToken = require("../utils/auth/verifyAccessToken");

const userAuthentication = asyncHandle(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Yêu cầu xác thực",
        });
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = verifyAccessToken(token);
    if (!decodedToken) {
        return res.status(401).json({
            success: false,
            message: "Token không hợp lệ",
        });
    }
    const user = await userModel.findById(decodedToken._id).populate("user_roles");
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Token truy cập không hợp lệ",
        });
    }
    req.user = user;
    next();
});
module.exports = { userAuthentication  };
