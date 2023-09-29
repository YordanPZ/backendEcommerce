const { getAll, create, getOne, remove, update,setProductImage } = require("../controllers/product.controller")
const express = require("express")
const verifyJWT = require("../utils/verifyJWT")

const productRouter = express.Router()

productRouter.route("/")
    .get(getAll)
    .post(verifyJWT,create)

productRouter.route("/:id/image")
    .post(verifyJWT,setProductImage)

productRouter.route("/:id")
    .get(getOne)
    .delete(verifyJWT,remove)
    .put(verifyJWT,update)

module.exports = productRouter