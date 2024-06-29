import express from 'express';
import bodyParser from 'body-parser';

var controller = express();
controller.use(bodyParser.json());
controller.get('/getIP', async (res,req) => {
    const ipAddress = req.socket.remoteAddress;
    console.log(ipAddress);
});

module.exports = controller;