"use strict";

const PurchasedProductService = require("../services/purchasedProduct.service");

class PurchasedProductController {
    static async getByUser(req, res) {
        res.status(201).json({
            success: true,
            data: await PurchasedProductService.getByUser({ userId: req.user._id, ...req.query }),
            message: 'Thành công'
        });
    }


}

module.exports = PurchasedProductController;