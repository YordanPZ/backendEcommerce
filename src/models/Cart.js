const { DataTypes } = require("sequelize")
const sequelize = require("../utils/connection")

const Cart = sequelize.define("cart", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product: {
        type: DataTypes.JSON,
        allowNull: true 
    }
})

module.exports = Cart