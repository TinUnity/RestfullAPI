import express from 'express';
import cors from 'cors';
import { createConnection } from 'typeorm';
import { User } from './Entities/UserDB';
import { PlayerManager } from './Entities/PlayerManagerDB';
import { Player } from './Entities/PlayerDB';
import WebSocket from 'websocket';
import { createServer } from 'http';

const app = express();
app.use(cors());
app.use(express.json());
const port = Number(3000);
const server = createServer(app);

createConnection({
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
}).then(async connection => {
    console.log('TypeOrm With Mongodb');
    app.use(require('./Routers/index'));

    console.log('Websocket is connected');
    const webSocket = new WebSocket.server({ httpServer: server });
    webSocket.on('request', (request) => {
        const connection = request.accept(null, request.origin);

        connection.on('message', (message) => {
            if (message.type === 'utf8') {
                console.log(`Received: ${message.utf8Data}`);

                // Send a response back to the client
                console.log("message: " + message);
                connection.sendUTF(`You sent: ${message.utf8Data}`);
            }
        });

        connection.on('close', (reasonCode, description) => {
            console.log(`Client disconnected: ${reasonCode} - ${description}`);
        });
    });

    server.listen(port, () => console.log("connected to port:" + port));
}).catch(err => {
    console.log(err);
});