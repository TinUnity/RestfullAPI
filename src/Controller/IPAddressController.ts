import express from 'express';
import bodyParser from 'body-parser';
import { ip, ipv6, mac } from 'address';

var controller = express();
controller.use(bodyParser.json());
controller.get('/ipv4', function (req,res) {
    mac(function (err, addr) {
        console.log(addr);
        res.send(addr);
    });    
});

module.exports = controller;