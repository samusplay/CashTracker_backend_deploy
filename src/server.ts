import colors from 'colors'
import express from 'express'
import morgan from 'morgan'
import { db } from './config/db'

//conexion db
async function connectDB(){
    try {
        await db.authenticate()
        //crea las tablas en automatico
        db.sync()
        console.log(colors.blue.bold('Conexion Exitosa a la BD'))
    } catch (error) {
        //console.log(error)
        console.log(colors.red.bold('Fallo la conexion a la BD'))
    }

}
//llamamos a la funcion
connectDB()

const app = express()

app.use(morgan('dev'))

app.use(express.json())



export default app