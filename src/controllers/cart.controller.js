const catchError = require("../utils/catchError")
const Cart = require("../models/Cart")
const Product = require("../models/Product")

const getAll = catchError(async(req, res) => {
    const { user } = req
    const results = await Cart.findAll({where: {userId: user.id}})
    return res.json(results)
})

const create = catchError(async(req, res) => {
    const {productId} = req.body
    const product = await Product.findByPk(productId)
    if (!product) return res.status(404).json({message: "Product not found"})
    const { user } = req
    const result = await Cart.create({...req.body,userId: user.id})
    return res.status(201).json(result)
})

const remove = catchError(async(req, res) => {
    const { id } = req.params
    await Cart.destroy({ where: {id} })
    return res.sendStatus(204)
})

const update = catchError(async(req, res) => {
    const { id } = req.params
    const {quantity} = req.body
    const result = await Cart.update(
        {quantity},
        { where: {id}, returning: true }
    )
    if(result[0] === 0) return res.sendStatus(404)
    return res.json(result[1][0])
})

module.exports = {
    getAll,
    create,
    remove,
    update
}