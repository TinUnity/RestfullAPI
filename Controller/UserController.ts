import express from 'express';
import bodyParser from 'body-parser';

const controller = express();
controller.use(bodyParser.json());
controller.post('/register', async (req, res) => {
    try {
        res.send("HELLO")
    } catch (error) {
        
    }
});


module.exports = controller;