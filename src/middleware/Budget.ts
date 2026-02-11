import { NextFunction, Request, Response } from "express";
import { param, validationResult } from "express-validator";

//validar parametros
export const validateBudgetId=async(req: Request, res: Response, next: NextFunction) => {

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