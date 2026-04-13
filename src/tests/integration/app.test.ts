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
        const createAccountMock=jest.spyOn(AuthController,'createAccount')
        console.log(response.body)

        expect(response.status).toBe(400)
        //tenga tres errores
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(3)

        expect(response.status).not.toBe(201)
        //no se mande llamar el controlador
        expect(createAccountMock).not.toHaveBeenCalled()


    })
})