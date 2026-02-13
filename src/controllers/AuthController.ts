import { type Request, type Response } from "express"
import { AuthEmail } from "../emails/AuthEmail"
import User from "../models/User"
import { hashPassword } from "../utils/auth"
import { generateToken } from "../utils/token"

export class AuthController {
    //metodo del controlador estatico
    static createAccount = async (req: Request, res: Response) => {
        //extraer el email
        const {email,password}=req.body
        //prevenir duplicado
        const userExists=await User.findOne({
            where:{
                email
            }
        })
        if(userExists){
            const error=new Error('Un usuario con ese email ya esta registrado')
            return res.status(409).json({error:error.message})
        }
       try {
        //guardamos nuevo usuario
        const user=new User(req.body)
        //agregamos la encriptacion con salt
        user.password=await hashPassword(password)
        //llamamos la funcion para generar el token
        user.token=generateToken()
        await user.save()
         await AuthEmail.sendConfirmationEmail({
            //en base a los types
            name:user.name,
            email:user.email,
            token:user.token
        })
        //respuesta
        res.json('Cuenta Creada correctamente')
       } catch (error) {
        //console.log(error)
        res.status(500).json({error:'Hubo un error'})
       }

    }

}