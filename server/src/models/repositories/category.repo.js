const { convertToObjectIdMongodb } = require("../../utils")
const Category = require("../category.model.js")


const findCartById = async (cartId) => {
    return await Category.findById({ _id: convertToObjectIdMongodb(cartId) }).lean()
}

module.exports = findCartById