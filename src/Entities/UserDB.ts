import { Entity, Column, BaseEntity, ObjectIdColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm"

@Entity()
export class User extends BaseEntity{
    @ObjectIdColumn()
    _id: any

    @PrimaryColumn()
    userId: string

    @Column()
    gmail: string

    @Column()
    password: string

    @Column()
    isVerify: boolean

    @Column()
    username: string
}