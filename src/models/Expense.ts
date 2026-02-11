import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import Budget from './Budget'

//definimos la tabla
@Table({
    tableName: 'expenses'
})
//hereda la funcionalidad del modelo
class Expense extends Model {
    @Column({
        type: DataType.STRING(100)
    })
    declare name: string

    @Column({
        type: DataType.DECIMAL
    })
    declare amount: number

    //llave foranea
    @ForeignKey(()=>Budget)
    declare budgetId:number

    //relacion
    @BelongsTo(()=>Budget)
    declare budget:Budget

}
export default Expense