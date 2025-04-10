'use strict';

const OrderService = require('../services/order.service');

class OrderController {
    static async createOrder(req, res) {
        res.status(201).json({
            success: true,
            data: await OrderService.createOrder({ userId: req.user._id, ...req.body }),
            message: 'Đặt hàng thành công',
        });
    }

    static async createOfflineOrder(req, res) {
        res.status(201).json({
            success: true,
            data: await OrderService.createOfflineOrder({ adminId: req.admin._id, ...req.body }),
            message: 'Tạo đơn hàng thành công',
        });
    }
    static async getAllOrdersOffline(req, res) {
        res.status(201).json({
            success: true,
            data: await OrderService.getAllOrdersOffline({ ...req.query }),
        });
    }
    static async getAllOrdersByUser(req, res) {
        res.status(201).json({
            success: true,
            data: await OrderService.getAllOrdersByUser({ userId: req.user._id, ...req.query }),
        });
    }
    static async getAllOrders(req, res) {
        res.status(201).json({
            success: true,
            data: await OrderService.getAllOrders(req.query),
        });
    }
    static async updateOrderStatus(req, res) {
        res.status(201).json({
            success: true,
            data: await OrderService.updateOrderStatus(req.body),
            message: 'Cập nhật trạng thái đơn hàng thành công',
        });
    }
    static async getOrder(req, res) {
        res.status(201).json({
            success: true,
            data: await OrderService.getOrder(req.params.oid),
            message: 'Thành công',
        });
    }
    static async getAllOfflineOrders(req, res) {
        const data = await OrderService.getAllOfflineOrders(req.query);
        res.status(200).json({
            success: true,
            data,
            message: 'Lấy danh sách đơn hàng offline thành công',
        });
    }
    
}

module.exports = OrderController;
