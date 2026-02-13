import { type Request, type Response } from "express"
import User from "../models/User"

export class AuthController {
    //metodo del controlador estatico
    static createAccount = async (req: Request, res: Response) => {
       try {
        //guardamos nuevo usuario
        const user=new User(req.body)
        await user.save()
        //respuesta
        res.json('Cuenta Creada correctamente')
       } catch (error) {
        //console.log(error)
        res.status(500).json({error:'Hubo un error'})
       }

    }

}