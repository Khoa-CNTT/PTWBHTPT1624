const mongoose = require('mongoose');

const purchasedProductSchema = new mongoose.Schema({
    pc_userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Tham chiếu đến model User
        required: true
    },
    pc_productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Tham chiếu đến model Product
        required: true
    },
    pc_quantity: {
        type: Number,
        required: true,
        min: 1
    },
    pc_purchaseDate: {
        type: Date,
        default: Date.now
    },
    pc_isReviewed: {
        type: Boolean,
        default: false // Mặc định là chưa đánh giá
    },
});

const PurchasedProduct = mongoose.model('PurchasedProduct', purchasedProductSchema);

module.exports = PurchasedProduct;