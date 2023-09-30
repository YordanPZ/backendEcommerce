/* eslint-disable no-undef */
const request = require("supertest")
const app = require("../app")
const Category = require("../models/Category")
const Image = require("../models/Image")
const Product = require("../models/Product")
require("../models")

let id
let token
let IdCategory 

beforeAll(async () => {
    const body = {
        email: "test@gmail.com",
        password: "test1234"
    }
    const res = await request(app).post("/users/login").send(body)
    token = res.body.token
})


test("/GET /products debe retornar todos las products", async () => { 
    const response = await request(app).get("/products")
    expect(response.statusCode).toBe(200) 
    expect(response.body).toBeInstanceOf(Array)
})

test("/POST /products debe crear un product",async () => {
    IdCategory = await Category.create({name:"testing"})

    const body = {
        title: "test",
        description: "test",
        categoryId:IdCategory.id,
        brand:"test" ,
        price:200
    }
    const response = await request(app).post("/products").set("Authorization", `Bearer ${token}`).send(body)
    id = response.body.id
    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty("id")
    expect(response.body.title).toBe(body.title)
})

test("/GET /products/:id debe retornar el producto deacuerdo al id", async () => {
    const response = await request(app).get(`/products/${id}`)
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty("id")
    expect(response.body.id).toBe(id)
})

test("/PUT /products/:id debe actualizar un product", async () => {
    const body = {
        title:"XXXX"
    }
    const response = await request(app).put(`/products/${id}`).set("Authorization", `Bearer ${token}`).send(body)
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty("id")
    expect(response.body.title).toBe(body.title)

})

test("/POST /products/:id/image debe setear una imagen al producto",async () => {
    const body = {
        url:"test",
        publicId:"tests",
        productId:null
    }
    const toSet = await Image.create(body)
    const response = await request(app).post(`/products/${id}/image`).set("Authorization", `Bearer ${token}`).send([toSet.id])
    await toSet.destroy()
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBe(1)
  
})

test("/GET /category_id/:id debe retornar los productos que pertenezcan a esa categoria", async () => {
    const response = await request(app).get(`/products/category_id/${IdCategory.id}`)
    expect(response.statusCode).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBeGreaterThanOrEqual(0)
})

test("/GET /products/name debe retornar los productos que coincidan con el titulo o la descripción", async () => {
    const body = {
        title: "test",
        description: "test",
        categoryId:IdCategory.id,
        brand:"test" ,
        price:200
    }
    const product = await Product.create(body)
    const response = await request(app).get("/products/name").send({title:body.title})
    await product.destroy()
    await IdCategory.destroy()
    expect(response.statusCode).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBeGreaterThanOrEqual(0)
})

test("/DELETE /products/:id debe eliminar un product", async () => { 
    const response = await request(app).delete(`/products/${id}`).set("Authorization", `Bearer ${token}`)
    expect(response.statusCode).toBe(204) 
})