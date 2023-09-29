const { DataTypes } = require("sequelize")
const sequelize = require("../utils/connection")

const image = sequelize.define("image", {
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    publicId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productId: {
        type: DataTypes.INTEGER,
    }
})

module.exports = image