import { createRequest, createResponse } from 'node-mocks-http'
import { hasAccess } from '../../../middleware/Budget'
import { validateExpensetExist } from '../../../middleware/expense'
import Expense from '../../../models/Expense'
import { budgets } from '../../mocks/budgets'
import { expenses } from '../../mocks/expenses'

jest.mock('../../../models/Expense',()=>({
    //importamos la funcion
    findByPk:jest.fn()
}))
describe('Expenses Middleware- validateExpenseExits',()=>{
    //antes que empieze la prueba
    beforeEach(()=>{
        //recuperar implementacion
        (Expense.findByPk as jest.Mock).mockImplementation((id)=>{
            //devolver objeto
            const expense=expenses.filter(e=>e.id===id)[0] ??null
            return Promise.resolve(expense)

        })
    })
    it('should handle a non-existent budget',async()=>{
        const req=createRequest({
            params:{expenseId:120}

        });
        const res=createResponse()
        const next=jest.fn()
        //llamamos al middleware
        await validateExpensetExist(req,res,next)
        const data=res._getJSONData()
        //esperamos
        expect(res.statusCode).toBe(404)
        expect(data).toEqual({error:' Gasto no encontrado'})
        //esperamos que no se llame next
        expect(next).not.toHaveBeenCalled()

    })

    it('should  call next middleware if expense exists',async()=>{
        const req=createRequest({
            params:{expenseId:1}
        });
        const res=createResponse()
        const next=jest.fn()
        //llamamos al middleware
        await validateExpensetExist(req,res,next)
    
        //esperamos que se llame next
        expect(next).toHaveBeenCalled()
        expect(next).toHaveBeenCalledTimes(1)
        expect(req.expense).toEqual(expenses[0])

    })

     it('should handle internal server error',async()=>{
        //rechasar la solictud
        (Expense.findByPk as jest.Mock).mockRejectedValue(new Error)
        const req=createRequest({
            params:{expenseId:1}
        });
        const res=createResponse()
        const next=jest.fn()
        //llamamos al middleware
        await validateExpensetExist(req,res,next)
    
        const data=res._getJSONData()
        //esperamos que se llame next
        expect(next).not.toHaveBeenCalled()
        expect(res.statusCode).toBe(500)
        expect(data).toEqual({error:'Hubo un error'})

    })

    it('should prevent unauthorized users from adding expenses',async()=>{
        const req=createRequest({
            method:'POST',
            url:'/api/budgets/:budgetId/expenses',
            budget:budgets[0],
            user:{id:20},
            body:{name:'Expense Test',amount:3000}
        })
        const res=createResponse()
        const next=jest.fn()
        hasAccess(req,res,next)
        //evaluamos
        const data=res._getJSONData()
        expect(res.statusCode).toBe(401)
        expect(data).toEqual({error:'Accion no valida'})
        expect(next).not.toHaveBeenCalled()

    })


})