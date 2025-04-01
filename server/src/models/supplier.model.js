const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify'); // Chỉ khai báo một lần

const supplierSchema = new Schema({
    supplier_name: { type: String, required: true },
    supplier_address: { type: String },
    supplier_email: { type: String, required: true },
    supplier_phone: { 
        type: String, 
        required: true,
        validate: {
            validator: function(value) {
                return /^\d{10,11}$/.test(value);
            },
            message: "Số điện thoại phải có từ 10 đến 11 chữ số"
        }
    },
    supplier_description: { type: String },
}, { timestamps: true });


module.exports = mongoose.model('Supplier', supplierSchema);
