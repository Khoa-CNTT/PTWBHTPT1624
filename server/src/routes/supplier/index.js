const express = require("express");
const SupplierController = require("../../controllers/supplier.controller");
const asyncHandle = require("../../helper/asyncHandle");
const { adminAuthentication, restrictTo } = require("../../middlewares/auth.admin.middleware");
const PERMISSIONS = require("../../config/permissions");
const router = express.Router();

// Áp dụng middleware xác thực trước khi thực hiện các hành động quản lý nhà cung cấp
router.use(adminAuthentication)
router.use(restrictTo(PERMISSIONS.SUPPLIER_COMPANY_MANAGE))
router.post("/add", asyncHandle(SupplierController.createSupplier));
router.get("/all", asyncHandle(SupplierController.getAllSuppliers));
router.get("/:id/search", asyncHandle(SupplierController.getSupplierById));
router.put("/:id", asyncHandle(SupplierController.updateSupplier));
router.delete("/:id", asyncHandle(SupplierController.deleteSupplier));


module.exports = router;
