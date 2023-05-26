import express from 'express';
import cors from 'cors';
import { createConnection } from 'typeorm';

const app = express();
app.use(cors());
app.use(express.json());
const port = Number(3000);

createConnection().then(async connection => {
    console.log('TypeOrm With Mongodb');
    app.use(require('./Routers/index'));

    app.listen(port, () => console.log("connected to port:" + port));
}).catch(err => {
    console.log(err);
});
