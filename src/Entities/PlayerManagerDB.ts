import {Entity, PrimaryColumn, OneToMany, BaseEntity, ObjectIdColumn} from "typeorm";
import {Player} from './PlayerDB';

@Entity()
export class PlayerManager extends BaseEntity{
    @ObjectIdColumn()
    _id: any

    @PrimaryColumn()
    userId: string

    @OneToMany(() => Player, (player) => player.playerManager)
    players: Player[]
} 