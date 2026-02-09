
import { Column, DataType, Model, Table } from 'sequelize-typescript'
//sequialize
@Table({
    //declaramos nombre
    tableName:'budgets'
})

class Budget extends Model{
    @Column({
        type:DataType.STRING(100)
    })
    name:string

    @Column({
        type:DataType.DECIMAL
    })
    amount:number


}

export default Budget