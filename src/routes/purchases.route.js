const { getAll, create } = require("../controllers/purchases.controller")
const express = require("express")
const verifyJWT = require("../utils/verifyJWT")

const purchasesRouter = express.Router()

purchasesRouter.route("/")
    .get(verifyJWT,getAll)
    .post(verifyJWT,create)

module.exports = purchasesRouter