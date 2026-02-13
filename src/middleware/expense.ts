import { NextFunction, Request, Response } from "express"
import { body } from "express-validator"
import Expense from "../models/Expense"


//agregamos propiedades al request
declare global{
    namespace Express{
        interface Request{
            expense?:Expense
        }
    }
}
export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {
    //Reglas de validacion
     await body("name")
            .notEmpty()
            .withMessage("El nombre del gasto no puede ir vacio").run(req)
        
        await body("amount")
            .notEmpty()
            .withMessage("La cantidad del gasto no puede ir vacia")
            .isNumeric()
            .withMessage("Cantidad no valida")
            .custom((value) => value > 0)
            .withMessage("El gasto debe ser mayor a 0").run(req)
    
    //vaya al siguiente middleware
    next()
}

export const validateExpensetExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //pasamos parametro
            const { expenseId }=req.params
            //encontramos con sequialize
            const expense=await Expense.findByPk(expenseId as string)
            if(!expense){
                const error=new Error(' Gasto no encontrado')
                return res.status(404).json({error:error.message})
            }
            //agregamos el request el global
            req.expense=expense

            next()
        } catch (error) {
            //console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    
}