const express = require("express");
const DashboardController = require("../../controllers/dashboard.controller");
const asyncHandle = require("../../helper/asyncHandle");

const router = express.Router();

// Route lấy dữ liệu Dashboard
router.get("/", asyncHandle(DashboardController.getDashboardStats));
router.get("/new", asyncHandle(DashboardController.getNewUsers));
router.get("/potential", asyncHandle(DashboardController.getPotentialCustomers));
// Lấy thống kê Dashboard
router.get('/stats', DashboardController.getProductStats);

module.exports = router;
