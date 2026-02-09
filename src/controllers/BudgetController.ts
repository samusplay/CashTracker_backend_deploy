import type { Request, Response } from "express"
import Budget from "../models/Budget"


//se maneja en clases el controlador
export class BudgetController {
    //metodo del controlador estatico
    static getAll = async (req: Request, res: Response) => {
        console.log('Desde /api/budgets')
    }
    static create = async (req: Request, res: Response) => {
        try {
            //llama al modelo de la base de datos
            const budget=new Budget(req.body)

            await budget.save()
            res.status(201).json('Prespuesto Creado Correctamente')
        } catch (error) {
            //console.log(error)
            res.status(500).json({error:'Hubo un error'})
        }
    }

     static getById = async (req: Request, res: Response) => {
        console.log('Desde POST /api/budgets/id')
    }
      static updateById = async (req: Request, res: Response) => {
        console.log('Desde PUT /api/budgets/id')
    }
      static deleteById = async (req: Request, res: Response) => {
        console.log('Desde DELETE /api/budgets/id')
    }
}