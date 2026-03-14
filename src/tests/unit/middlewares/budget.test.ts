import { createRequest, createResponse } from "node-mocks-http"
import { hasAccess, validateBudgetExist } from "../../../middleware/Budget"
import Budget from "../../../models/Budget"
import { budgets } from "../../mocks/budgets"
jest.mock('../../../models/Budget', () => ({
    //las funciones a  simular
    findByPk: jest.fn()


})
)

describe('budget Middleware -validateBudgetExists', () => {
    it('should handle non-existent budget', async () => {
        (Budget.findByPk as jest.Mock).mockResolvedValue(null)
        //request
        const req = createRequest({
            params: {
                budgetId: 1
            }
        })
        //response
        const res = createResponse()
        //next
        const next = jest.fn()

        //llamamos al middleware
        await validateBudgetExist(req, res, next)
        //pruebas para validar el error
        expect(res.statusCode).toBe(404)
        const data = res._getJSONData()
        expect(data).toEqual({ error: 'Presupuesto no encontrado' })
        //esperamos que el next nunca se llame
        expect(next).not.toHaveBeenCalled()
    })

    it('should proceed to next middleware if budget exits', async () => {
        //pasarle el mock para que resuleva el primero

        (Budget.findByPk as jest.Mock).mockResolvedValue(budgets[0])
        //request
        const req = createRequest({
            params: {
                budgetId: 1
            }
        })
        //response
        const res = createResponse()
        //next
        const next = jest.fn()

        await validateBudgetExist(req, res, next)
        //si existe mandamos llamar la funcion de next
        expect(next).toHaveBeenCalled()
        //esperamos que se agrege ese budget
        expect(req.budget).toEqual(budgets[0])
    })

    it('should handle non-existent budget', async () => {
        //mandar hacia la expecion
        (Budget.findByPk as jest.Mock).mockRejectedValue(new Error)
        //request
        const req = createRequest({
            params: {
                budgetId: 1
            }
        })
        //response
        const res = createResponse()
        //next
        const next = jest.fn()

        //llamamos al middleware
        await validateBudgetExist(req, res, next)
        //pruebas para validar el error
        expect(res.statusCode).toBe(500)
        const data = res._getJSONData()
        expect(data).toEqual({ error: 'Hubo un error' })
        //esperamos que el next nunca se llame
        expect(next).not.toHaveBeenCalled()
    })

})

//usuario tiene acceso al presupuesto
describe('budget Middleware -hasAccess', () => {
    //no hay async/await ya que no interactuamos con un modelo
    it('should call next() if user access to budget', () => {
        const req = createRequest({
            //pasarle la posicion 1
            budget: budgets[0],
            user: { id: 1 }
        })
        //response
        const res = createResponse()
        //next
        const next = jest.fn()
        hasAccess(req, res, next)
        //que se mande llamar
        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)

    })

    it('should call next() if user access to budget', () => {
        const req = createRequest({
            //pasarle la posicion 1
            budget: budgets[0],
            user: { id: 1 }
        })
        //response
        const res = createResponse()
        //next
        const next = jest.fn()
        hasAccess(req, res, next)
        //que se mande llamar
        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)

    })

    it('should return 401 error if userid does not have access to budget', () => {
        const req = createRequest({
            //pasarle la posicion 1
            budget: budgets[0],
            user: { id: 2 }
        })
        //response
        const res = createResponse()
        //next
        const next = jest.fn()

        hasAccess(req,res,next)
        expect(next).not.toHaveBeenCalled()
        expect(res.statusCode).toBe(401)
        expect(res._getJSONData()).toEqual({error:'Accion no valida'})
       

    })



})