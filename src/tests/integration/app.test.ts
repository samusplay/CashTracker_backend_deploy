//pruebas de Integracion
import request from 'supertest'
import { AuthController } from '../../controllers/AuthController'
import { AuthEmail } from '../../emails/AuthEmail'
import User from '../../models/User'
import server from '../../server'
import * as authUtils from '../../utils/auth'
import * as jwtUtils from '../../utils/jwt'
//agrupamos con describe
describe('Autentication-Create account', () => {

    it('should display validation errors when form is empty', async () => {

        const response = await request(server)
            .post('/api/auth/create-account')
            //mandamos la peticion vacia
            .send({})
        //hacemos un mock
        const createAccountMock = jest.spyOn(AuthController, 'createAccount')


        expect(response.status).toBe(400)
        //tenga tres errores
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(3)

        expect(response.status).not.toBe(201)
        //no se mande llamar el controlador
        expect(createAccountMock).not.toHaveBeenCalled()
    })

    it('should return 400 when the email is invalid', async () => {

        const response = await request(server)
            .post('/api/auth/create-account')
            //mandamos la peticion vacia
            .send({
                "name": "samuel",
                "password": "12345678",
                "email": "not_valid_email"
            })
        //hacemos un mock
        const createAccountMock = jest.spyOn(AuthController, 'createAccount')


        expect(response.status).toBe(400)
        //tenga tres errores
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('E-mail no valido')

        expect(response.status).not.toBe(201)
        //no se mande llamar el controlador
        expect(response.body.errors).not.toHaveLength(2)
        expect(createAccountMock).not.toHaveBeenCalled()
    })

    it('should return 400 status code when the password is less than 8 characters', async () => {

        const response = await request(server)
            .post('/api/auth/create-account')
            //mandamos la peticion vacia
            .send({
                "name": "samuel",
                "password": "short",
                "email": "test@test.com"
            })
        //hacemos un mock
        const createAccountMock = jest.spyOn(AuthController, 'createAccount')


        expect(response.status).toBe(400)
        //tenga tres errores
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)

        //capturar el mensaje y evaluarlo
        expect(response.body.errors[0].msg).toBe('El password es muy corto, minimo 8 caracteres')

        expect(response.status).not.toBe(201)
        //no se mande llamar el controlador
        expect(response.body.errors).not.toHaveLength(2)
        expect(createAccountMock).not.toHaveBeenCalled()
    })

    it('should register a new successfully', async () => {
        // mock simulamos dicho comportamiento
        const sendEmailMock = jest
            .spyOn(AuthEmail, 'sendConfirmationEmail')
            .mockResolvedValue()

        const userData = {
            "name": "samuel",
            "password": "password",
            "email": "test@test.com"
        }

        const response = await request(server)
            .post('/api/auth/create-account')
            .send(userData)

        expect(response.status).toBe(201)
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')
        // ← LÍNEA NUEVA: verificamos que el mock fue llamado
        expect(sendEmailMock).toHaveBeenCalledTimes(1)
    })

    it('should return 409 conflict when a user is already registered', async () => {

        const userData = {
            "name": "samuel",
            "password": "password",
            "email": "test@test.com"
        }

        const response = await request(server)
            .post('/api/auth/create-account')
            //mandamos la peticion vacia
            .send(userData)


        expect(response.status).toBe(409)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Un usuario con ese email ya esta registrado')
        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(201)
        expect(response.body).not.toHaveProperty('errors')



    })
})

describe('authentication- Account  confirmation with token', () => {

    it('should display error if token is empty or is not valid', async () => {
        //simulamos el comportamiento
        const response = await request(server)
            .post('/api/auth/confirm-account')
            .send({
                token: "not_valid"
            })
        //cubrimos ecenarios
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Token no valido')
    })

    it('should display error if token doenst exists', async () => {
        //simulamos el comportamiento
        const response = await request(server)
            .post('/api/auth/confirm-account')
            .send({
                //puede ser que exista
                token: "123456"
            })
        //cubrimos ecenarios
        expect(response.status).toBe(401)
        //errors es exprres validator
        expect(response.body).toHaveProperty('error')

        expect(response.body.error).toBe('Token no valido')
        expect(response.status).not.toBe(200)
    })

    it('should confirm account with a valid token', async () => {
        //extraemos antes de  enviar al request
        const token = globalThis.cashTrackrConfirmationToken
        //simulamos el comportamiento hacemos dinamico con el Global this
        const response = await request(server)
            .post('/api/auth/confirm-account')
            .send({ token })

        //lo qe esperamos de la prueba
        expect(response.status).toBe(200)
        expect(response.body).toBe("Cuenta confirmada correctamente")
        expect(response.status).not.toBe(401)

    })


})

//pruebas Login
describe('Authenticaction -login', () => {

    //un before each para que  se llame una vez
    beforeEach(() => {
        //va limpiar los mock previos
        jest.clearAllMocks()
    })

    //pruebas de integracion siempre son asincronicas
    it('should display validation errors when the form is empty', async () => {
        //simulamos el envio de datos
        const response = await request(server)
            .post('/api/auth/login')
            .send({})

        //simulamos el auth controller con spyon
        const loginMock = jest.spyOn(AuthController, 'login')

        //lo que esperamos que pase en la prueba
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)
        expect(response.body.errors).not.toHaveLength(1)

        expect(loginMock).not.toHaveBeenCalled()
    })

    it('should return 400 bad request when the email is invalid', async () => {
        //simulamos el envio de datos
        const response = await request(server)
            .post('/api/auth/login')
            .send({
                "password": "password",
                "email": "not_valid"
            })

        //simulamos el auth controller con spyon
        const loginMock = jest.spyOn(AuthController, 'login')

        //lo que esperamos que pase en la prueba
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors).not.toHaveLength(2)

        //validando que el email no es valido
        expect(response.body.errors[0].msg).toBe('Email no valido')
        expect(loginMock).not.toHaveBeenCalled()
    })

    it('should return a 400  error if the use is not found', async () => {
        //simulamos el envio de datos
        const response = await request(server)
            .post('/api/auth/login')
            .send({
                "password": "password",
                "email": "user_not_found@test.com"
            })



        //lo que esperamos que pase en la prueba
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')

        //validando que el email no es valido
        expect(response.body.error).toBe('Usuario no encontrado')
        expect(response.status).not.toBe(200)

    })

    it('should return a 403  error if the user account is not confirmed', async () => {

        //simularemos que este exista el user pero no este confirmado
        (jest.spyOn(User, 'findOne') as jest.Mock)
            .mockResolvedValue({
                id: 1,
                confirmed: false,
                password: "hashedPassword",
                email: "user_not_confirmed@test.com"
            })


        //simulamos el envio de datos
        const response = await request(server)
            .post('/api/auth/login')
            .send({
                "password": "password",
                "email": "user_not_confirmed@test.com"
            })



        //lo que esperamos que pase en la prueba
        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('error')

        //validando que el email no es valido
        expect(response.body.error).toBe('La cuenta no ha sido confirmada')
        expect(response.status).not.toBe(200)
        expect(response.status).not.toBe(404)

    })

    it('should return a 403  error if the user account is not confirmed -second form', async () => {

        //simulamos la peticion del usuario
        const userData = {
            name: "test",
            password: "password",
            email: "user_not_confirmed@test.com"
        }
        await request(server).post('/api/auth/create-account')
            .send(userData)

        //simulamos el envio de datos
        const response = await request(server)
            .post('/api/auth/login')
            .send({
                "password": userData.password,
                "email": userData.email
            })



        //lo que esperamos que pase en la prueba
        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('error')

        //validando que el email no es valido
        expect(response.body.error).toBe('La cuenta no ha sido confirmada')
        expect(response.status).not.toBe(200)
        expect(response.status).not.toBe(404)

    })


    it('should return a 401  error if the password is incorrect', async () => {

        //simularemos que este exista el user pero no este confirmado
        const findOne = (jest.spyOn(User, 'findOne') as jest.Mock)
            .mockResolvedValue({
                id: 1,
                confirmed: true,
                password: "hashedPassword"

            })
        //mock para simular la confirmacion de contraseña
        const chekcPassword = jest.spyOn(authUtils, 'checkPaswword')
            .mockResolvedValue(false)



        //simulamos el envio de datos
        const response = await request(server)
            .post('/api/auth/login')
            .send({
                "password": "wrongPassword",
                "email": "test@test.com"
            })



        //lo que esperamos que pase en la prueba
        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('error')

        //validando que el email no es valido
        expect(response.body.error).toBe('Password Incorrecto')
        expect(response.status).not.toBe(200)
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(403)
        expect(findOne).toHaveBeenCalledTimes(1)
        expect(chekcPassword).toHaveBeenCalledTimes(1)

    })

    it('should return a jwt', async () => {

        //simularemos que este exista el user pero no este confirmado
        const findOne = (jest.spyOn(User, 'findOne') as jest.Mock)
            .mockResolvedValue({
                id: 1,
                confirmed: true,
                password: "hashedPassword"

            })
        //mock para simular la confirmacion de contraseña
        const chekcPassword = jest.spyOn(authUtils, 'checkPaswword')
            .mockResolvedValue(true)

        //generemos el tercer mock para simular funciones 
        //va depender si son funciones o clases
        const generateJwt = (jest.spyOn(jwtUtils, 'generateJWT')).mockReturnValue('jwt_token')


        //simulamos el envio de datos
        const response = await request(server)
            .post('/api/auth/login')
            .send({
                "password": "correctPassword",
                "email": "test@test.com"
            })

        expect(response.status).toBe(200)
        expect(response.body).toEqual('jwt_token')
        expect(findOne).toHaveBeenCalled()
        expect(findOne).toHaveBeenCalledTimes(1)

        expect(chekcPassword).toHaveBeenCalled()
        expect(chekcPassword).toHaveBeenCalledTimes(1)
        expect(chekcPassword).toHaveBeenCalledWith('correctPassword', 'hashedPassword')

        expect(generateJwt).toHaveBeenCalled()
        expect(generateJwt).toHaveBeenCalledTimes(1)
        //que mande llamar con los parametros le pasamos el id de la prueba
        expect(generateJwt).toHaveBeenCalledWith(1)




    })


})
//disponible globalmente
let jwt: string

async function autneticactionUser() {

    const response = await request(server)
        .post('/api/auth/login')
        .send({
            password: "password",
            email: "budget_test@test.com"
        })

    jwt = response.body
    expect(response.status).toBe(200)
}

describe('GET /api/budgets', () => {
    beforeAll(async () => {
        await autneticactionUser()
        // 1. Limpiar mocks para que el JWT sea real
        jest.restoreAllMocks()

        // 2. Mock solo del email
        jest.spyOn(AuthEmail, 'sendConfirmationEmail').mockResolvedValue()

        // 3. Crear cuenta con email único
        await request(server)
            .post('/api/auth/create-account')
            .send({
                name: "test budgets",
                password: "password",
                email: "budget_test@test.com"
            })

        // 4. Confirmar con el nuevo token generado
        const token = globalThis.cashTrackrConfirmationToken
        await request(server)
            .post('/api/auth/confirm-account')
            .send({ token })

        // 5. Login → ahora sí retorna JWT real
        const response = await request(server)
            .post('/api/auth/login')
            .send({
                password: "password",
                email: "budget_test@test.com"
            })

        jwt = response.body
        expect(response.status).toBe(200)
    })

    it('should reject unauthenticated access to budgets without a  jwt', async () => {
        const response = await request(server).get('/api/budgets')

        expect(response.status).toBe(401)
        expect(response.body.error).toBe('No Autorizado')
    })

    it('should reject unauthenticated access to budgets without a valid jwt', async () => {
        const response = await request(server)
            .get('/api/budgets')
            .auth('not_valid', { type: 'bearer' })


        expect(response.status).toBe(500)
        expect(response.body.error).toBe('Token no valido')
    })

    it('should allow authenticated access to budgets with a valid a jwt', async () => {
        const response = await request(server)
            .get('/api/budgets')
            //especificamos una autenticacion como en postman 
            .auth(jwt, { type: 'bearer' })

        expect(response.body).toHaveLength(0)
        expect(response.status).not.toBe(401)
        expect(response.body.error).not.toBe('No Autorizado')
    })





})


describe('POST /api/budgets', () => {


    beforeAll(async () => {
        await autneticactionUser()
    })


    it('should reject unauthenticated post request budgets without a  jwt', async () => {
        const response = await request(server).post('/api/budgets')

        expect(response.status).toBe(401)
        expect(response.body.error).toBe('No Autorizado')
    })

    it('should display validation when the form is submitted with invalid data', async () => {
        const response = await request(server)
            .post('/api/budgets')
            .auth(jwt, { type: 'bearer' })
            .send({})

        expect(response.status).toBe(400)
        expect(response.body.errors).toHaveLength(4)
    })


})

describe('GET /api/budgets/:id', () => {

    beforeAll(async () => {
        await autneticactionUser()

        // Crear un budget real en la DB
        await request(server)
            .post('/api/budgets')
            .auth(jwt, { type: 'bearer' })
            .send({
                name: "Graduación",
                amount: 1000
            })
    })


    it('should reject unauthenticated get request budget id without a  jwt', async () => {
        const response = await request(server).get('/api/budgets/1')

        expect(response.status).toBe(401)
        expect(response.body.error).toBe('No Autorizado')
    })

    it('should return 400 bad request when id is not valid', async () => {
        const response = await request(server)
            .get('/api/budgets/not_valid')
            //necesitamos estar auntenciados para 
            .auth(jwt, { type: 'bearer' })

        expect(response.status).toBe(400)
        //este definido
        expect(response.body.errors).toBeDefined()
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Id no valido')
        expect(response.status).not.toBe(401)
        expect(response.body.error).not.toBe('No Autorizado')
    })

    it('should return 404  not found when a budget doesnt exists', async () => {
        const response = await request(server)
            .get('/api/budgets/3000')
            //necesitamos estar auntenciados para 
            .auth(jwt, { type: 'bearer' })
        expect(response.status).toBe(404)
        //este definido
        expect(response.body.error).toBe('Presupuesto no encontrado')
        expect(response.status).not.toBe(401)
        expect(response.status).not.toBe(400)
    })

    it('should return a single budget by id', async () => {
        const response = await request(server)
            .get('/api/budgets/1')
            //necesitamos estar auntenciados para 
            .auth(jwt, { type: 'bearer' })
        expect(response.status).toBe(200)
        //este definido
        //son datos dinamicos
        expect(response.status).not.toBe(401)
        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
    })




})


describe('PUT /api/budgets/:id', () => {

    beforeAll(async () => {
        await autneticactionUser()

        // Crear un budget real en la DB
        await request(server)
            .post('/api/budgets')
            .auth(jwt, { type: 'bearer' })
            .send({
                name: "Graduación",
                amount: 1000
            })
    })


    it('should reject unauthenticated put request budget id without a  jwt', async () => {
        const response = await request(server).put('/api/budgets/1')

        expect(response.status).toBe(401)
        expect(response.body.error).toBe('No Autorizado')
    })


    it('should  display validation errors if the form is empty', async () => {
        const response = await request(server)
            .put('/api/budgets/1')
            .auth(jwt, { type: 'bearer' })
            .send({})

        expect(response.status).toBe(400)
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(4)
    })

    it('should  update a budget by id and return a success message', async () => {
        const response = await request(server)
            .put('/api/budgets/1')
            .auth(jwt, { type: 'bearer' })
            .send({
                name: "updated budget",
                amount: 300
            })

        expect(response.status).toBe(200)

        expect(response.body).toBe('Presupuesto actualizado correctamente')
    })










})


describe('DELETE /api/budgets/:id', () => {

    beforeAll(async () => {
        await autneticactionUser()

        // Crear un budget real en la DB
        await request(server)
            .post('/api/budgets')
            .auth(jwt, { type: 'bearer' })
            .send({
                name: "Graduación",
                amount: 1000
            })
    })


    it('should reject unauthenticated put request budget id without a  jwt', async () => {
        const response = await request(server).delete('/api/budgets/1')

        expect(response.status).toBe(401)
        expect(response.body.error).toBe('No Autorizado')
    })


    it('should return 404 not fouund when a budget doesnt exists ', async () => {
        const response = await request(server)
            .delete('/api/budgets/3000')
            .auth(jwt, { type: 'bearer' })
         

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Presupuesto no encontrado')
    })

    it('should  delete a budget and return  a success message', async () => {
        const response = await request(server)
            .delete('/api/budgets/1')
            .auth(jwt, { type: 'bearer' })
           

        expect(response.status).toBe(200)

        expect(response.body).toBe('Presupuesto eliminado correctamente')
    })
})