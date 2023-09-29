/* eslint-disable no-undef */
const request = require("supertest")
const app = require("../app")

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


test("/GET /categories debe retornar todas las categories", async () => { 
    const response = await request(app).get("/categories")
    expect(response.statusCode).toBe(200) 
    expect(response.body).toBeInstanceOf(Array)
})

test("/POST /categories debe crear un category",async () => {
    const body = {
        name:"testing"
    }
    const response = await request(app).post("/categories").set("Authorization", `Bearer ${token}`).send(body)
    id = response.body.id
    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty("id")
    expect(response.body.name).toBe(body.name)
})

test("/GET /categories/:id debe retornar la categoria deacuerdo al id", async () => {
    const response = await request(app).get(`/categories/${id}`)
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty("id")
    expect(response.body.id).toBe(id)
})

test("/PUT /categories/:id debe actualizar un category", async () => {
    const body = {
        name:"XXXX"
    }
    const response = await request(app).put(`/categories/${id}`).set("Authorization", `Bearer ${token}`).send(body)
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty("id")
    expect(response.body.name).toBe(body.name)

})

test("/DELETE /categories/:id debe eliminar un category", async () => { 
    const response = await request(app).delete(`/categories/${id}`).set("Authorization", `Bearer ${token}`)
    expect(response.statusCode).toBe(204) 
})