import express from 'express';
import bodyParser from 'body-parser';

var controller = express();
controller.use(bodyParser.json());
controller.get('/ipv4', function (req,res) {
    console.log("Your IP Addresss is: " + req.socket.remoteAddress);
    res.send("Your IP Addresss is: " + req.socket.remoteAddress);
});

module.exports = controller;