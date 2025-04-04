const mongoose = require("mongoose")
const slugify = require("slugify")

const brandSchema = mongoose.Schema({
    brand_name: { type: String, require: true, unique: true },
    brand_slug: { type: String, require: true },
    brand_banner : { type: String, require: true },
}, {
    timestamps: true
})
brandSchema.pre("save", function (next) {
    this.brand_slug = slugify(this.brand_name, { lower: true })
    next();
})
module.exports = mongoose.model("Brand", brandSchema)