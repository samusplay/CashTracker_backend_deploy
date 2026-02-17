import { type Request, type Response } from "express"
import { AuthEmail } from "../emails/AuthEmail"
import User from "../models/User"
import { checkPaswword, hashPassword } from "../utils/auth"
import { generateToken } from "../utils/token"
import { hash } from "bcrypt"
import { generateJWT } from "../utils/jwt"

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

    static confirmAcccount=async(req:Request,res:Response)=>{
        //extraemos de la solictud
        const {token}=req.body

        const user=await User.findOne({
            where:{token}
        })
        if(!user){
            const error=new Error('Token no valido')
            return res.status(401).json({error:error.message})
        }
        //si el usuario confirma su cuenta solo una vez
        user.confirmed=true
        user.token=null

        //guardamos
        await user.save()
        
        res.json("Cuenta confirmada correctamente")

    }
    static login = async (req: Request, res: Response) =>{

        const {email,password}=req.body
        //revisar que el codigo exista
        const user=await User.findOne({
            where:{
                email
            }
        })
        if(!user){
            const error=new Error('Usuario no encontrado')
            return res.status(404).json({error:error.message})
        }
        //si el usuario ya confirmo su cuenta
        if(!user.confirmed){
             const error=new Error('La cuenta no ha sido confirmada')
            return res.status(403).json({error:error.message})

        }
        //revisar la contraseña
        const isPasswordCorrect= await checkPaswword(password,user.password)
         if(!isPasswordCorrect){
             const error=new Error('Password Incorrecto')
            return res.status(401).json({error:error.message})

        }
        //pasarl el id para leerlo en el jwt
        const token=generateJWT(user.id)

        //entregamos respuesta token
        res.json(token)

    }

    static forgotPassword = async (req: Request, res: Response) =>{
         const {email}=req.body
        //revisar que el codigo exista
        const user=await User.findOne({
            where:{
                email
            }
        })
        if(!user){
            const error=new Error('Usuario no encontrado')
            return res.status(404).json({error:error.message})
        }
        //generar token
        user.token=generateToken()
        //almacenar en la base de datos
        await user.save()
        //envaimos el email
        await AuthEmail.sendPasswordResetToken({
            name:user.name,
            email:user.email,
            token:user.token
        })
        res.json('Revisa tu email para instrucciones')

    }

    static validateToken = async (req: Request, res: Response) =>{
        //extraemos token
        const {token}=req.body

       const tokenExists=await User.findOne({where:{token}})
       //si no existe enviamos error
       if(!tokenExists){
        const error=new Error('Token no valido')
        //agregamos estado http
        return res.status(404).json({error:error.message})

       }

    }

}