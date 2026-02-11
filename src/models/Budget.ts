
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript'
import Expense from './Expense'
//sequialize
@Table({
    //declaramos nombre
    tableName:'budgets'
})

class Budget extends Model{
    @Column({
        type:DataType.STRING(100)
    })
     declare name:string

    @Column({
        type:DataType.DECIMAL
    })
     declare amount:number

     @HasMany(()=>Expense,{
        //Restrcciones de integridad
        onUpdate:'CASCADE',
        onDelete:'CASCADE'
     })
     //se lleva en arreglo
     declare expenses:Expense[]


}

export default Budget