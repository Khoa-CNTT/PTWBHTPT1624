const express = require("express");
const VoucherController = require("../../controllers/voucher.controller");
const asyncHandle = require("../../helper/asyncHandle");
const { adminAuthentication ,restrictTo} = require("../../middlewares/auth.admin.middleware");
const PERMISSIONS = require("../../config/permissions");
const router = express.Router();



// Lấy danh sách tất cả voucher
router.get("/all", asyncHandle(VoucherController.getAllVouchers));
// router.use(adminAuthentication)
// router.use(restrictTo(PERMISSIONS.VOUCHER_MANAGE))
// Tìm kiếm voucher theo tên
router.get("/search", asyncHandle(VoucherController.searchVoucherByName));
// Thêm mới voucher
router.post("/add", asyncHandle(VoucherController.createVoucher));
// Lấy chi tiết voucher theo ID
router.get("/:id/search", asyncHandle(VoucherController.getVoucherById));
// Cập nhật voucher theo ID
router.put("/:id/update", asyncHandle(VoucherController.updateVoucher));
// Xóa voucher theo ID
router.delete("/:id/delete", asyncHandle(VoucherController.deleteVoucher));

module.exports = router;
