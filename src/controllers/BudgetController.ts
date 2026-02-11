import { type Request, type Response } from "express"
import Budget from "../models/Budget"


//se maneja en clases el controlador
export class BudgetController {
    //metodo del controlador estatico
    static getAll = async (req: Request, res: Response) => {
        try {
            const budgets = await Budget.findAll({
                //sql
                order: [
                    ['createdAt', 'DESC']
                ],
                //filtrar por por el usuario autenticado


            })
            res.json(budgets)
        } catch (error) {
            //console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
    static create = async (req: Request, res: Response) => {
        try {
            //llama al modelo de la base de datos
            const budget = new Budget(req.body)

            await budget.save()
            res.status(201).json('Prespuesto Creado Correctamente')
        } catch (error) {
            //console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static getById = async (req: Request, res: Response) => {
        //con la configuracion global extendemos el request
        res.json(req.budget)
    }
    static updateById = async (req: Request, res: Response) => {
        //ulizamos un middleware
        await req.budget.update(req.body)
        res.json('Presupuesto actualizado correctamente')
    }
    static deleteById = async (req: Request, res: Response) => {
       await req.budget.destroy()
            res.json('Presupuesto eliminado correctamente')
    }
}