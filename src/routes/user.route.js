const { getAll, create, getOne, remove, update,login } = require("../controllers/user.controller")
const express = require("express")
const verifyJWT = require("../utils/verifyJWT")

const userRoute = express.Router()

userRoute.route("/")
    .get(verifyJWT,getAll)
    .post(create)

userRoute.route("/login")
    .post(login)

userRoute.route("/:id")
    .get(verifyJWT,getOne)
    .delete(verifyJWT,remove)
    .put(verifyJWT,update)

module.exports = userRoute