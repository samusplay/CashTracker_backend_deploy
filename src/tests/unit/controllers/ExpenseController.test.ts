import { createRequest, createResponse } from "node-mocks-http";
import { ExpensesController } from "../../../controllers/ExpenseController";
import Expense from "../../../models/Expense";
import { expenses } from "../../mocks/expenses";

//generamos mock datos de prueba
jest.mock('../../../models/Expense', () => ({
    //importamos el metodo
    create: jest.fn()

}))

describe('ExpensesController.create', () => {
    it('should create a new expense', async () => {
        const expenseMock = {
            save: jest.fn().mockResolvedValue(true)
        };
        //llamar a la funcionalidad
        (Expense.create as jest.Mock).mockResolvedValue(expenseMock)

        //parametros que se llama sirve tambien como documentacion
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            //campos que pasamos
            body: { name: 'Test Expense', amount: 500 },
            //obligatorio
            budget: { id: 1 }
        })
        //necesitamos una respuesta
        const res = createResponse()

        //llamamos controlador
        await ExpensesController.create(req, res)
        //esperar que sucedan
        expect(res.statusCode).toBe(201)
        //tomar mensajes
        const data = res._getJSONData()
        expect(data).toEqual('Gasto Agregado correctamente')
        expect(expenseMock.save).toHaveBeenCalled()
        expect(expenseMock.save).toHaveBeenCalledTimes(1)
        expect(Expense.create).toHaveBeenCalledWith(req.body)


    })
    it('should handle expense creation error', async () => {
        const expenseMock = {
            save: jest.fn()
        };
        //forzar el error
        (Expense.create as jest.Mock).mockRejectedValue(new Error)

        //parametros que se llama sirve tambien como documentacion
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets/:budgetId/expenses',
            //campos que pasamos
            body: { name: 'Test Expense', amount: 500 },
            //obligatorio
            budget: { id: 1 }
        })
        //necesitamos una respuesta
        const res = createResponse()

        //llamamos controlador
        await ExpensesController.create(req, res)
        //esperar que sucedan
        expect(res.statusCode).toBe(500)
        //tomar mensajes
        const data = res._getJSONData()
        expect(data).toEqual({ error: 'Hubo un error' })
        expect(expenseMock.save).not.toHaveBeenCalled()
        expect(Expense.create).toHaveBeenCalledWith(req.body)


    })


})

describe('ExpensesController.getById', () => {
    it('should return expense with ID 1', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            //enviamos el objeto
            expense: expenses[0]
        })
        //necesitamos una respuesta
        const res = createResponse()
        //llamar al controlador
        await ExpensesController.getById(req, res)
        //esperamos
        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data).toEqual(expenses[0])
    })

})

describe('ExpensesController.deleteById', () => {
    it('should handle expense Update ', async () => {
        //creamos un objeto pórque update solo vive en squailize
        const expenseMock = {
            ...expenses[0],
            update: jest.fn().mockResolvedValue(true)
        }
        const req = createRequest({
            method: 'PUT',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            //enviamos el objeto
            expense: expenseMock,
            body: { name: 'Updated Expense', amount: 100 }
        })
        //necesitamos una respuesta
        const res = createResponse()
        //llamar al controlador
        await ExpensesController.updateById(req, res)
        //esperamos
        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data).toEqual('Se actualizo correctamente')
        expect(expenseMock.update).toHaveBeenCalledWith(req.body)
        expect(expenseMock.update).toHaveBeenCalledTimes(1)

    })

})

describe('ExpensesController.updateById', () => {
    it('should delete expense and return a success message ', async () => {
        //creamos un objeto pórque update solo vive en squailize
        const expenseMock = {
            ...expenses[0],
            destroy: jest.fn().mockResolvedValue(true)
        }
        const req = createRequest({
            method: 'DELETE',
            url: '/api/budgets/:budgetId/expenses/:expenseId',
            //enviamos el objeto
            expense: expenseMock,
          
        })
        //necesitamos una respuesta
        const res = createResponse()
        //llamar al controlador
        await ExpensesController.deleteById(req, res)
        //esperamos
        const data = res._getJSONData()
        expect(res.statusCode).toBe(200)
        expect(data).toEqual('Gasto eliminado')
        expect(expenseMock.destroy).toHaveBeenCalled()
        expect(expenseMock.destroy).toHaveBeenCalledTimes(1)

    })

})

