//
import request from 'supertest'
import { AuthController } from '../../controllers/AuthController'
import server from '../../server'
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

    it('should return 400 status code when the password is less than 8 characters', async () => {

        const userData = {
            "name": "samuel",
            "password": "password",
            "email": "test@test.com"
        }

        const response = await request(server)
            .post('/api/auth/create-account')
            //mandamos la peticion vacia
            .send(userData)
        expect(response.status).toBe(201)
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('errors')



    })
})