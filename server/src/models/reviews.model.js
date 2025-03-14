const mongoose = require("mongoose");

const reviewsSchema = new mongoose.Schema({
    review_rating: { type: Number, default: 0 },
    review_user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    review_comment: { type: String, required: true },
    review_images: { type: Array, default: [] },
    review_likes: { type: Array, default: [] },
    review_productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    isApproved: { type: Boolean, default: false } // Mặc định chưa duyệt
}, { timestamps: true });

module.exports = mongoose.model("Reviews", reviewsSchema);
