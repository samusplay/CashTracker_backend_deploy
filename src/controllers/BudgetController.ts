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