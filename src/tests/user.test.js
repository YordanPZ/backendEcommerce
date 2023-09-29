/* eslint-disable no-undef */
const request = require("supertest")
const app = require("../app")

let id
let token


test("/POST /users debe crear un usuario",async () => {
    const body = {
        firstName:"test",
        lastName:"test lastName",
        email:"XXXXXXXXXXXXX",
        password:"XXXXXXXXXXXXX",
        phone:123
    }
    const response = await request(app).post("/users").send(body)
    id = response.body.id
    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty("id")
    expect(response.body.firstName).toBe(body.firstName)
    expect(response.body.password).toBeFalsy()
})

test("/POST /users/login debe loguear un usuario", async () => { 
    const body = {
        email:"XXXXXXXXXXXXX",
        password:"XXXXXXXXXXXXX"
    }
    const response = await request(app).post("/users/login").send(body)
    token = response.body.token
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty("token")

})

test("/GET /users debe retornar todos los usuarios", async () => { 
    const response = await request(app).get("/users").set("Authorization", `Bearer ${token}`)
    expect(response.statusCode).toBe(200) 
    expect(response.body).toBeInstanceOf(Array)
})

test("/GET /users/:id debe retornar el usuerio deacuerdo al id", async () => {
    const response = await request(app).get(`/users/${id}`).set("Authorization", `Bearer ${token}`)
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty("id")
    expect(response.body.id).toBe(id)
})

test("/PUT /users/:id debe actualizar un usuario", async () => {
    const body = {
        firstName:"XXXX",
        lastName:"XXXXXXXXXXXXX",
        phone:123
    }
    const response = await request(app).put(`/users/${id}`).set("Authorization", `Bearer ${token}`).send(body)
    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty("id")
    expect(response.body.firstName).toBe(body.firstName)

})



test("/DELETE /users/:id debe eliminar un usuario", async () => { 
    const response = await request(app).delete(`/users/${id}`).set("Authorization", `Bearer ${token}`)
    expect(response.statusCode).toBe(204) 
})