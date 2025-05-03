const express = require('express');
const OrderControllers = require('../../controllers/order.controller');
const asyncHandle = require('../../helper/asyncHandle');
const { adminAuthentication, restrictTo } = require('../../middlewares/auth.admin.middleware');
const PERMISSIONS = require('../../config/permissions');
const { userAuthentication } = require('../../middlewares/auth.user.middleware');

const router = express.Router();

router.get('/:oid/detail', asyncHandle(OrderControllers.getOrder));

router.post('/add', [userAuthentication], asyncHandle(OrderControllers.createOrder));
router.get('/by-user', [userAuthentication], asyncHandle(OrderControllers.getAllOrdersByUser));
router.put('/:id/cancel', [userAuthentication], asyncHandle(OrderControllers.cancelOrder));
router.put('/:id/re-order', [userAuthentication], asyncHandle(OrderControllers.reorder));
router.use(adminAuthentication);
router.use(restrictTo(PERMISSIONS.ORDER_MANAGE));
router.get('/all', asyncHandle(OrderControllers.getAllOrders));
router.put('/update-status', asyncHandle(OrderControllers.updateOrderStatus));
router.post('/add-offline', asyncHandle(OrderControllers.createOfflineOrder));
router.get('/offline-all', asyncHandle(OrderControllers.getAllOrdersOffline));
router.get('/search/:code', asyncHandle(OrderControllers.getOrderByCode));
router.get('/offline/search/:code', asyncHandle(OrderControllers.getOfflineOrderByCode));

module.exports = router;
