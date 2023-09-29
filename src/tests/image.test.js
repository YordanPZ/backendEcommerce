/* eslint-disable no-undef */
const request = require("supertest")
const app = require("../app")

let token

beforeAll(async () => {
    const body = {
        email: "test@gmail.com",
        password: "test1234"
    }
    const res = await request(app).post("/users/login").send(body)
    token = res.body.token
})
  

test("GET /product_images debe traer todas las compras realizadas", async () => {
    const response = await request(app).get("/product_images").set("Authorization", `Bearer ${token}`)
    expect(response.statusCode).toBe(200)
    expect(response.body.length).toBeGreaterThanOrEqual(0)
 
})