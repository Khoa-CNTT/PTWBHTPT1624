const express = require("express");
const BannerController = require("../../controllers/banner.controller");
const asyncHandle = require("../../helper/asyncHandle");
const PERMISSIONS = require("../../config/permissions");
const { adminAuthentication ,restrictTo} = require("../../middlewares/auth.admin.middleware");

const router = express.Router();

router.get("/all", asyncHandle(BannerController.getAllBanners));
router.use(adminAuthentication)
router.use(restrictTo(PERMISSIONS.BANNER_MANAGE))
//tìm theo tên
router.get("/search", asyncHandle(BannerController.searchBanner));
// Thêm banner
router.post("/add", asyncHandle(BannerController.createBanner));
// Lấy banner theo ID
router.get("/:id/search", asyncHandle(BannerController.getBannerById));
// Cập nhật banner
router.put("/:id/update", asyncHandle(BannerController.updateBanner));

// Xóa banner
router.delete("/:id/delete", asyncHandle(BannerController.deleteBanner));


module.exports = router;
