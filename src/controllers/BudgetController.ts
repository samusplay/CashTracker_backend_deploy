import { type Request, type Response } from "express"
import Budget from "../models/Budget"


//se maneja en clases el controlador
export class BudgetController {
    //metodo del controlador estatico
    static getAll = async (req: Request, res: Response) => {
        try {
            const budgets=await Budget.findAll({
                //sql
                order:[
                    ['createdAt','DESC']
            ],
            //filtrar por por el usuario autenticado
          

            })
            res.json(budgets)
        } catch (error) {
            //console.log(error)
            res.status(500).json({error:'Hubo un error'})
        }
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
        try {
            const { id }=req.params
            //encontramos con sequialize
            const budget=await Budget.findByPk(id as string)
            if(!budget){
                const error=new Error('Presupuesto no encontrado')
                return res.status(404).json({error:error.message})
            }
            res.json(budget)

        } catch (error) {
            //console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
      static updateById = async (req: Request, res: Response) => {
        //encontrar el presupuesto
         try {
            const { id }=req.params
            //encontramos con sequialize
            const budget=await Budget.findByPk(id as string)
            if(!budget){
                const error=new Error('Presupuesto no encontrado')
                return res.status(404).json({error:error.message})
            }
            //escribir los campos del body
             await budget.update(req.body)
             res.json('Presupuesto actualizado correctamente')

        } catch (error) {
            //console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
      static deleteById = async (req: Request, res: Response) => {
        try {
            //leer desde la url
            const { id }=req.params
            //encontramos con sequialize
            const budget=await Budget.findByPk(id as string)
            if(!budget){
                const error=new Error('Presupuesto no encontrado')
                return res.status(404).json({error:error.message})
            }
            //retornar que eliminamos
            await budget.destroy()
            res.json('Presupuesto eliminado correctamente')
        } catch (error) {
            //console.log(error)
            res.status(500).json({ error: 'Hubo un error' })
        }
    }
}