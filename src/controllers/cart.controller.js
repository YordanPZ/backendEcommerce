const catchError = require("../utils/catchError")
const Cart = require("../models/Cart")
const Product = require("../models/Product")
const Image = require("../models/Image")

const getAll = catchError(async(req, res) => {
    const { user } = req
    const results = await Cart.findAll({where: {userId: user.id}})
    return res.json(results)
})

const create = catchError(async(req, res) => {
    const {productId} = req.body
    const isInCart = await Cart.findOne({where: {userId: req.user.id,productId}})
    if (isInCart){
        isInCart.quantity += 1
        await isInCart.save()
        return res.json(isInCart)
    }
    const product = await Product.findByPk(productId,{
        include:Image 
    },{attributes: { exclude: ["createdAt", "updatedAt"]}})
    
    if (!product) return res.status(404).json({message: "Product not found"})
    const { user } = req
    const result = await Cart.create({...req.body,userId: user.id,product:product})
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