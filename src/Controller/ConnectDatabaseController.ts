import { DataSource  } from 'typeorm';
import { User } from '../Entities/UserDB';
import { PlayerManager } from '../Entities/PlayerManagerDB';
import { Player } from '../Entities/PlayerDB';

export const appDataSource = new DataSource({
    type: "mongodb",
    useNewUrlParser: true,
    url: "mongodb+srv://tinho:e2AyDLohJHVBxGYt@cluster0.jhixplb.mongodb.net/test",
    database: "Colyseus",
    synchronize: true,
    logging: true,
    useUnifiedTopology: true,
    entities: [User, PlayerManager, Player],
    extra: {
        connectionLimit: 10,
    },
})

module.exports = appDataSource;