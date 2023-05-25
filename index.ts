import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
const port = Number(3000);

app.use(require('./Routers/index'));

app.listen(port,()=>console.log("connected to port:"+port));