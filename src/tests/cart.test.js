/* eslint-disable no-undef */
const request = require("supertest")
const app = require("../app")
const User = require("../models/User")
const Product = require("../models/Product")
const Category = require("../models/Category")

require("../models")

let id
let token

beforeAll(async () => {
    const body = {
        email: "test@gmail.com",
        password: "test1234"
    }
    const res = await request(app).post("/users/login").send(body)
    token = res.body.token
})

test("/GET /cart debe retornar todos los productos del carrito", async () => { 
    const response = await request(app).get("/cart").set("Authorization", `Bearer ${token}`)
    expect(response.statusCode).toBe(200) 
    expect(response.body).toBeInstanceOf(Array)
})

test("/POST /cart agregar un producto al carrito",async () => {
    const category = await Category.create({
        name:"s"
    })

    const bodyUser = {
        firstName:"XXXX",
        lastName:"XXXX",
        email:"test@.cssddom",
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
        userId: user.id,
        productId: product.id,
        quantity:1 
    }
    const response = await request(app).post("/cart").set("Authorization", `Bearer ${token}`).send(body)
    id = response.body.id
    await category.destroy()
    await product.destroy()
    await user.destroy()
    expect(response.statusCode).toBe(201)
    expect(response.body.productId).toBe(product.id)
})

test("/PUT /cart/:id debe actualizar el quantity de un producto", async () => {
    const body = {
        quantity:3
    }
    const response = await request(app).put(`/cart/${id}`).set("Authorization", `Bearer ${token}`).send(body)
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty("id")
    expect(response.body.quantity).toBe(body.quantity)

})
test("/PUT /cart/:id solo puede actualizar el quantity de un producto", async () => {
    const body = {
        productId:3,
        userId:4
    }
    const response = await request(app).put(`/cart/${id}`).set("Authorization", `Bearer ${token}`).send(body)
    expect(response.statusCode).toBe(404)
})

test("/DELETE /cart/:id debe eliminar un producto del carrito", async () => { 
    const response = await request(app).delete(`/cart/${id}`).set("Authorization", `Bearer ${token}`)
    expect(response.statusCode).toBe(204) 
})

