
import { AllowNull, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript'
import Expense from './Expense'
import User from './User'
//sequialize
@Table({
    //declaramos nombre
    tableName:'budgets'
})

class Budget extends Model{

    @AllowNull(false)
    @Column({
        type:DataType.STRING(100)
    })
     declare name:string

    @AllowNull(false)
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

     //llamar la llave foranea
     @ForeignKey(()=>User)
     declare userId:number

     //pertenece
     @BelongsTo(()=>User)
     declare user:User

    


}

export default Budget