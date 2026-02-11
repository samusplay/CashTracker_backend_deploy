import { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";
import Budget from "../models/Budget";

//agregamos propiedades al request
declare global{
    namespace Express{
        interface Request{
            budget:Budget
        }
    }
}
//validar parametros
export const validateBudgetId = async (req: Request, res: Response, next: NextFunction) => {

    await param("budgetId")
        .isInt()
        .withMessage("Id no valido")
        .custom((value) => value > 0)
        .withMessage("Id no valido")
        .run(req)

    //para que ejcute la siguiente funcion 
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    next()
}

//middleware para validar si existe el budget
export const validateBudgetExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
            const { budgetId }=req.params
            //encontramos con sequialize
            const budget=await Budget.findByPk(budgetId as string)
            if(!budget){
                const error=new Error('Presupuesto no encontrado')
                return res.status(404).json({error:error.message})
            }
            req.budget=budget

            next()
        } catch (error) {
            //console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    
}

export const validateBudgetInput = async (req: Request, res: Response, next: NextFunction) => {
    //Reglas de validacion
     await body("name")
            .notEmpty()
            .withMessage("El nombre del presupuesto no puede ir vacio").run(req)
        
        await body("amount")
            .notEmpty()
            .withMessage("La cantidad del presupuesto no puede ir vacio")
            .isNumeric()
            .withMessage("Cantidad no valida")
            .custom((value) => value > 0)
            .withMessage("El presupuesto debe ser mayor a 0").run(req)
    
    //vaya al siguiente middleware
    next()
}