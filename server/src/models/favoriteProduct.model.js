'use strict';
const mongoose = require('mongoose');

const favoriteProductSchema = new mongoose.Schema(
    {
        fp_user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        fp_products: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], default: [] },
    },
    { timestamps: true },
);

// Chỉ mục để đảm bảo không có product trùng lặp trong mảng của cùng một user
favoriteProductSchema.index({ fp_user_id: 1 }, { unique: true });
module.exports = mongoose.model('favoriteProduct', favoriteProductSchema);
