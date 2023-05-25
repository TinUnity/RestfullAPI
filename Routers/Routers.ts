import express from 'express';

const routes = express.Router();
routes.use("/user",require("../Controller/UserController"));

module.exports = routes;