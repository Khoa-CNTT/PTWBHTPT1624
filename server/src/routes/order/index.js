const express = require('express');
const OrderControllers = require('../../controllers/order.controller');
const asyncHandle = require('../../helper/asyncHandle');
const { adminAuthentication, restrictTo } = require('../../middlewares/auth.admin.middleware');
const PERMISSIONS = require('../../config/permissions');
const { userAuthentication } = require('../../middlewares/auth.user.middleware');

const router = express.Router();

router.get('/:oid/detail', asyncHandle(OrderControllers.getOrder));
// Thêm sản phẩm
router.post('/add', [userAuthentication], asyncHandle(OrderControllers.createOrder));
router.get('/by-user', [userAuthentication], asyncHandle(OrderControllers.getAllOrdersByUser));
router.get('/all', asyncHandle(OrderControllers.getAllOrders));
router.use(adminAuthentication);
router.use(restrictTo(PERMISSIONS.ORDER_MANAGE));
router.put('/update-status', asyncHandle(OrderControllers.updateOrderStatus));
router.post('/add-offline', asyncHandle(OrderControllers.createOfflineOrder));
router.get('/offline-all', asyncHandle(OrderControllers.getAllOrdersOffline));

module.exports = router;
