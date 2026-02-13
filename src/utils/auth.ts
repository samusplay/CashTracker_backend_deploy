import bcrypt from 'bcrypt'

//funcion de generar password
//hashea de passwords

export const hashPassword=async(password:string)=>{
    //mas rondas mas seguro
    const salt=await bcrypt.genSalt(10)
    return await bcrypt.hash(password,salt)
}