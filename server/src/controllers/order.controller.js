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

    // Tìm kiếm đơn hàng theo mã order_code
    static async getOrderByCode(req, res) {
        try {
            const { code } = req.params;
            const order = await OrderService.getOrderByCode(code);
            
            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found',
                });
            }
            
            return res.status(200).json({
                success: true,
                data: order,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
    
    
    
}

module.exports = OrderController;
