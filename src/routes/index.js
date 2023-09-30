const express = require("express")
const router = express.Router()
const User = require("../routes/user.route")
const Category = require("../routes/category.route")
const Product = require("../routes/product.route")
const Image = require("../routes/image.route")
const Cart = require("../routes/cart.route")
const Purchases = require("../routes/purchases.route")

// colocar las rutas aquí
router.use("/users",User)
router.use("/categories",Category)
router.use("/products",Product)
router.use("/product_images", Image)
router.use("/cart", Cart)
router.use("/purchases", Purchases)

module.exports = router