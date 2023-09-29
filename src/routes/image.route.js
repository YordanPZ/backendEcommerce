const { getAll, create, remove } = require("../controllers/image.controller")
const express = require("express")
const upload = require("../utils/multer")
const routerName = express.Router()

routerName.route("/")
    .get(getAll)
    .post(upload.single("image"),create)

routerName.route("/:id")
    .delete(remove)

module.exports = routerName