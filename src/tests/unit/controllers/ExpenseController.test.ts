import { createRequest, createResponse } from "node-mocks-http";
import { ExpensesController } from "../../../controllers/ExpenseController";
import Expense from "../../../models/Expense";

//generamos mock datos de prueba
jest.mock('../../../models/Expense',()=>({
    //importamos el metodo
    create:jest.fn()

}))

describe('ExpensesController.create',()=>{
    it('should create a new expense',async()=>{
        const expenseMock={
            save:jest.fn().mockResolvedValue(true)
        };
        //llamar a la funcionalidad
        (Expense.create as jest.Mock).mockResolvedValue(expenseMock)

        //parametros que se llama sirve tambien como documentacion
        const req=createRequest({
            method:'POST',
            url:'/api/budgets/:budgetId/expenses',
            //campos que pasamos
            body:{name:'Test Expense',amount:500},
            //obligatorio
            budget:{id:1}
        })
        //necesitamos una respuesta
        const res=createResponse()

        //llamamos controlador
        await ExpensesController.create(req,res)
        //esperar que sucedan
        expect(res.statusCode).toBe(201)
        //tomar mensajes
        const data=res._getJSONData()
        expect(data).toEqual('Gasto Agregado correctamente')
        expect(expenseMock.save).toHaveBeenCalled()
        expect(expenseMock.save).toHaveBeenCalledTimes(1)
        expect(Expense.create).toHaveBeenCalledWith(req.body)


    })
     it('should handle expense creation error',async()=>{
        const expenseMock={
            save:jest.fn()
        };
        //forzar el error
        (Expense.create as jest.Mock).mockRejectedValue(new Error)

        //parametros que se llama sirve tambien como documentacion
        const req=createRequest({
            method:'POST',
            url:'/api/budgets/:budgetId/expenses',
            //campos que pasamos
            body:{name:'Test Expense',amount:500},
            //obligatorio
            budget:{id:1}
        })
        //necesitamos una respuesta
        const res=createResponse()

        //llamamos controlador
        await ExpensesController.create(req,res)
        //esperar que sucedan
        expect(res.statusCode).toBe(500)
        //tomar mensajes
        const data=res._getJSONData()
        expect(data).toEqual({error:'Hubo un error'})
        expect(expenseMock.save).not.toHaveBeenCalled()
        expect(Expense.create).toHaveBeenCalledWith(req.body)


    })


})