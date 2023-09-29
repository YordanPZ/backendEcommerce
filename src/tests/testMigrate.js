const User = require("../models/User")
const sequelize = require("../utils/connection")
const request = require("supertest")
const app = require("../app")

const main = async() => {
    try{
        // Acciones a ejecutar antes de los tests
        sequelize.sync()
        
        // Sólo en caso de error crea un usuario de prueba
        const user = await User.findOne({ where: { email: "test@gmail.com"}})
        if (!user) {
            const userTest = {
                email: "test@gmail.com",
                password: "test1234",
                firstName: "test",
                lastName: "test",
                phone: "123456789"
            }
            await request(app).post("/users").send(userTest)
        }
        
        process.exit()
    } catch(error){
        console.log(error)
    }
}

main()