import { NextFunction, Request, Response } from "express";
import { param, validationResult } from "express-validator";
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

    await param("id")
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

export const validateBudgetExist = async (req: Request, res: Response, next: NextFunction) => {
    try {
            const { id }=req.params
            //encontramos con sequialize
            const budget=await Budget.findByPk(id as string)
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