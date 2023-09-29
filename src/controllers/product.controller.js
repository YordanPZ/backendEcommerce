const catchError = require("../utils/catchError")
const Product = require("../models/Product")
const Category = require("../models/Category")
const Image = require("../models/Image")


//! FALTA: POST -> /products/:id/images (privado)

const getAll = catchError(async(req, res) => {
    const results = await Product.findAll({include: Image})
    return res.json(results)
})

const create = catchError(async(req, res) => {
    const {categoryId} = req.body
    const isValid = await Category.findByPk(categoryId)
    if(!isValid) return res.status(400).json({ error: "Category Invalid" })
    const result = await Product.create(req.body)
    return res.status(201).json(result)
})

const getOne = catchError(async(req, res) => {
    const { id } = req.params
    const result = await Product.findByPk(id)
    if(!result) return res.sendStatus(404)
    return res.json(result)
})

const remove = catchError(async(req, res) => {
    const { id } = req.params
    await Product.destroy({ where: {id} })
    return res.sendStatus(204)
})

const update = catchError(async(req, res) => {
    const { id } = req.params
    const result = await Product.update(
        req.body,
        { where: {id}, returning: true }
    )
    if(result[0] === 0) return res.sendStatus(404)
    return res.json(result[1][0])
})

const setProductImage  = catchError(async(req, res) => {
    const { id } = req.params
    const productToSet = await Product.findByPk(id)
    await productToSet.setImages(req.body)
    const image = await productToSet.getImages()
    return res.json(image)
})

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    setProductImage
}