const catchError = require("../utils/catchError")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const getAll = catchError(async(req, res) => {
    const results = await User.findAll()
    return res.json(results)
})

const create = catchError(async(req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const result = await User.create({...req.body, password: hashedPassword})
    return res.status(201).json(result)
})

const getOne = catchError(async(req, res) => {
    const { id } = req.params
    const result = await User.findByPk(id)
    if(!result) return res.sendStatus(404)
    return res.json(result)
})

const remove = catchError(async(req, res) => {
    const { id } = req.params
    const result = await User.findByPk(id)
    if(!result) return res.status(401).json({ error: "User Invalid" })
    await User.destroy({ where: {id} })
    return res.status(204).json({ message: "User deleted" })
})

const update = catchError(async(req, res) => {
    const { id } = req.params
    const result = await User.update(
        req.body,
        { where: {id}, returning: true }
    )
    if(result[0] === 0) return res.sendStatus(404)
    return res.json(result[1][0])
})

const login = catchError(async(req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ where: {email} })
    if(!user) return res.status(401).json({ error: "invalid credentials" })

    const isValid = await bcrypt.compare(password, user.password)
    if(!isValid) return res.status(401).json({ error: "invalid " })

    const token = jwt.sign(
        {user},
        process.env.TOKEN_SECRET,
        { expiresIn: "1d" }
    )

    return res.json({user, token})
})

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    login
}