import { exit } from 'node:process'
import { db } from '../config/db'

const clearData=async()=>{
    try {
        //limpia la base de datos
        await db.sync({force:true})
        console.log('Datos eliminados correctamente')
        exit[0]
    } catch (error) {
        //console.log(error)
        exit(1)
    }
}
//va tomar el arreglo posicion 2
if(process.argv[2]==='--clear'){
    clearData()

}
