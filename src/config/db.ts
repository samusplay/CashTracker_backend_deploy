import dotenv from 'dotenv'
import { Sequelize } from 'sequelize-typescript'

//instanciamos
dotenv.config()

export const db=new Sequelize(process.env.DATABASE_URL,{
    //que carpeta se encuentran los modelos
    models:[__dirname+'/../models/**/*'],
    logging:false,
    dialectOptions:{
        ssl:{
            require:false
        }
    }

})