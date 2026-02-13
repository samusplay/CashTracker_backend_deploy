import { AllowNull, Column, DataType, Default, HasMany, Model, Table, Unique } from 'sequelize-typescript'
import Budget from './Budget'

@Table({
    tableName:'users'
})

class User extends Model{

    @AllowNull(false)
    @Column({
        type:DataType.STRING(50)
    })
    declare nombre:string

    @AllowNull(false)
    @Column({
        type:DataType.STRING(60)
    })
    declare password:string

    @AllowNull(false)
    @Unique(true)
    @Column({
        type:DataType.STRING(50)
    })
    declare email:string

    
    @Column({
        type:DataType.STRING(50)
    })
    declare token:string

    //por default
    @Default(false)
    @Column({
        type:DataType.BOOLEAN
    })
    declare confirmed:string

    @HasMany(()=>Budget,{
       onUpdate:'CASCADE',
        onDelete:'CASCADE',
    })
    //acceder al arreglo
    declare budgets:Budget[]

}

export default User