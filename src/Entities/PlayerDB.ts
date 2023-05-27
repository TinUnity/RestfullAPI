import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, ObjectIdColumn } from "typeorm"
import {PlayerManager} from './PlayerManagerDB';

@Entity()
export class Player extends BaseEntity{
    @ObjectIdColumn()
    _id: any

    @PrimaryGeneratedColumn()
    idPlayer: string

    @Column()
    type: string

    @Column()
    namePlayer: string

    @Column()
    strengh: number

    @Column()
    flexible: number
    
    @Column()
    power: number

    @ManyToOne(() => PlayerManager, playerManager => playerManager.players)
    playerManager: PlayerManager

}