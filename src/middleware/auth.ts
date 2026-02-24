import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User'
declare global{
    namespace Express{
        interface Request{
            user?:User
        }
    }
}
export const authenticate=async(req:Request,res:Response,next:NextFunction)=>{
    //validar si viene el token
        const bearer=req.headers.authorization

        if(!bearer){
            const error=new Error('No Autorizado')
            return res.status(401).json({error:error.message})
            
        }
        //separa el bearer
        const [ ,token]=bearer.split(' ')
        if(!token){
            const error=new Error('Token no valido')
            return res.status(401).json({error:error.message})
        }
        //confirmar si lo hemos firmado ni expirado
        try {
            const decoded=jwt.verify(token,process.env.JWT_SECRET)
            //indetificar si la propiedad existe
            if(typeof decoded==='object'&&decoded.id){
                //traer atributos especificos
                req.user=await User.findByPk(decoded.id,{
                    attributes:['id','name','email']
                })
                //ir siguiente middleware
                next()
            }
           
        } catch (error) {
            res.status(500).json({error:'Token no valido'})
        }
}