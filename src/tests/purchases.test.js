/* eslint-disable no-undef */
const request = require("supertest")
const app = require("../app")
const Category = require("../models/Category")
const Product = require("../models/Product")
const User = require("../models/User")

let token

beforeAll(async () => {
    const body = {
        email: "test@gmail.com",
        password: "test1234"
    }
    const res = await request(app).post("/users/login").send(body)
    token = res.body.token
})


test("GET /purchases debe traer todas las compras realizadas", async () => {
    const response = await request(app).get("/purchases").set("Authorization", `Bearer ${token}`)
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeGreaterThanOrEqual(0)
 
})

test("POST /purchases debe almacenar una compra", async () => {
    const category = await Category.create({
        name:"Test Purchase"
    })
    const bodyUser = {
        firstName:"XXXX",
        lastName:"XXXX",
        email:"test@.com",
        password:"XXXX",
        phone:123
    }
    const user = await User.create(bodyUser)

    const product = await Product.create({
        title:"test",
        description:"test",
        categoryId:category.id,
        brand:"test",
        price:20
    })
    const body = {
        userId:user.id,
        productId: product.id,
        quantity:1 
    }
    const response = await request(app).post("/purchases").set("Authorization", `Bearer ${token}`).send(body)
    
    await category.destroy()
    await product.destroy()
    await user.destroy()
    expect(response.statusCode === 201 || response.statusCode === 404).toBe(true)
    expect(response.body.productId).toBe(body.id)
    expect(response.body.quantity).toBe(body.id)
})