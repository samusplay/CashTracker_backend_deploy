import dotenv from 'dotenv'
import { Sequelize } from 'sequelize-typescript'

//instanciamos
dotenv.config()

export const db=new Sequelize(process.env.DATABASE_URL,{
    dialectOptions:{
        ssl:{
            require:false
        }
    }

})