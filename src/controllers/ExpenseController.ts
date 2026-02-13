import type { Request, Response } from 'express'
import Expense from '../models/Expense'

export class ExpensesController {


    static create = async (req: Request, res: Response) => {
        try {
            //recuperar el id atravez de la instancia
            const expense = new Expense(req.body)
            expense.budgetId = req.budget.id
            //guardar en la base de datos
            await expense.save()
            res.status(201).json('Gasto Agregado correctamente')
        } catch (error) {
            //console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static getById = async (req: Request, res: Response) => {
        res.json(req.expense)

    }

    static updateById = async (req: Request, res: Response) => {
         await req.expense.update(req.body)
         res.json('Se actualizo correctamente')


    }

    static deleteById = async (req: Request, res: Response) => {
        //controladores limpios gracias a los middlewares
        await req.expense.destroy()
        res.json('Gasto eliminado')
  
    }
}