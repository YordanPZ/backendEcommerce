/* eslint-disable no-undef */
const request = require("supertest")
const app = require("../app")
const Category = require("../models/Category")
const Image = require("../models/Image")
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


test("/GET /products debe retornar todos las products", async () => { 
    const response = await request(app).get("/products")
    expect(response.statusCode).toBe(200) 
    expect(response.body).toBeInstanceOf(Array)
})

test("/POST /products debe crear un product",async () => {
    const categoryId = await Category.create({name:"testing"})

    const body = {
        title: "test",
        description: "test",
        categoryId:categoryId.id,
        brand:"test" ,
        price:200
    }
    const response = await request(app).post("/products").set("Authorization", `Bearer ${token}`).send(body)
    categoryId.destroy()
    id = response.body.id
    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty("id")
    expect(response.body.title).toBe(body.title)
})

test("/GET /products/:id debe retornar la categoria deacuerdo al id", async () => {
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

test("/DELETE /products/:id debe eliminar un product", async () => { 
    const response = await request(app).delete(`/products/${id}`).set("Authorization", `Bearer ${token}`)
    expect(response.statusCode).toBe(204) 
})