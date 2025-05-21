'use strict';

const productModel = require('../models/product.model');
const categoryModel = require('../models/category.model');
const brandModel = require('../models/brand.model');
const shippingCompanyModel = require('../models/shippingCompany.model');
const userModel = require('../models/user.model');
const textConverter = require('../utils/textConverter');
const redisClient = require('../config/redisClient'); // Sử dụng redisClient từ file cấu hình
const OnlineOrder = require('../models/OnlineOrder.model');

class ChatbotPromptController {
    static async getPrompt(req, res) {
        return res.status(200).json({ success: true, context: '' });
    }
}

module.exports = ChatbotPromptController;
