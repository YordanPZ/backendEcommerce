const Image = require("./Image")
const Product = require("./Product")
const Cart = require("./Cart")

Product.hasMany(Image) //Un producto puede tener muchas imagenes
Image.belongsTo(Product) //Una imagen pertenece a un Producto


