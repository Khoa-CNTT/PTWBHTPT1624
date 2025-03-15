const mongoose = require('mongoose');

const purchasedProductSchema = new mongoose.Schema({
    pc_userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pc_productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
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
        default: false
    },
}, { timestamps: true });

// Check if the model exists before compiling
module.exports = mongoose.models.purchasedProduct || mongoose.model('purchasedProduct', purchasedProductSchema);