import express from 'express';

const routes = express.Router();
routes.use('/user',require('../Controller/UserController'));
routes.use('/mail',require('../Controller/MailController').controller);
routes.use('/player',require('../Controller/PlayerController'))

module.exports = routes;