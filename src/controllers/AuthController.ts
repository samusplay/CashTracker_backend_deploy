import { type Request, type Response } from "express"

export class AuthController {
    //metodo del controlador estatico
    static createAccount = async (req: Request, res: Response) => {
        res.json('Creando Cuenta...')

    }

}