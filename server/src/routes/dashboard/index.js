const express = require("express");
const DashboardController = require("../../controllers/dashboard.controller");
const asyncHandle = require("../../helper/asyncHandle");

const router = express.Router();

// Route lấy dữ liệu Dashboard
router.get("/", asyncHandle(DashboardController.getDashboardStats));

module.exports = router;
