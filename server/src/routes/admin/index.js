const express = require("express");
const asyncHandle = require("../../helper/asyncHandle");
const { adminAuthentication ,restrictTo} = require("../../middlewares/auth.admin.middleware");
const PERMISSIONS = require("../../config/permissions");
const { userAuthentication } = require("../../middlewares/auth.user.middleware");
const adminController = require("../../controllers/admin.controller");

const router = express.Router();

// ✅ Xác thực trước khi truy cập API

 router.use(adminAuthentication);
router.get("/profile",  asyncHandle(adminController.getProfile));
router.put("/profile/update" ,asyncHandle(adminController.updateProfile));
router.use(restrictTo(PERMISSIONS.EMPLOYEE_MANAGE));
router.get("/all", asyncHandle(adminController.getAllAdmins));
router.post("/add", asyncHandle(adminController.addAdmin));
router.put("/:uid/update", asyncHandle(adminController.updateAdmin));
router.delete("/:uid/delete", asyncHandle(adminController.deleteAdmin));
router.put("/:uid/toggle-block", asyncHandle(adminController.toggleBlockAdmin));

module.exports = router;
