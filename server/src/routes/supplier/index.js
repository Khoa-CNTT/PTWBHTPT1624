const express = require("express");
const SupplierController = require("../../controllers/supplier.controller");
const asyncHandle = require("../../helper/asyncHandle");
const { adminAuthentication, restrictTo } = require("../../middlewares/auth.admin.middleware");
const PERMISSIONS = require("../../config/permissions");
const router = express.Router();

// Áp dụng middleware xác thực trước khi thực hiện các hành động quản lý nhà cung cấp
router.use(adminAuthentication);
router.use(restrictTo(PERMISSIONS.SUPPLIER_COMPANY_MANAGE));

// Tìm kiếm nhà cung cấp theo tên
router.get('/search', asyncHandle(SupplierController.searchSupplier));

// Thêm nhà cung cấp
router.post("/add", asyncHandle(SupplierController.createSupplier));

// Lấy tất cả nhà cung cấp
router.get("/all", asyncHandle(SupplierController.getAllSuppliers));

// Lấy thông tin nhà cung cấp theo ID
router.get("/:id", asyncHandle(SupplierController.getSupplierById));

// Cập nhật nhà cung cấp theo ID
router.put("/:id", asyncHandle(SupplierController.updateSupplier));

// Xóa nhà cung cấp theo ID
router.delete("/:id", asyncHandle(SupplierController.deleteSupplier));

module.exports = router;
