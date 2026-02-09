import type { Request, Response } from "express"


//se maneja en clases el controlador
export class BudgetController {
    //metodo del controlador estatico
    static getAll = async (req: Request, res: Response) => {
        console.log('Desde /api/budgets')
    }
    static create = async (req: Request, res: Response) => {
        console.log('Desde POST /api/budgets')
    }
}