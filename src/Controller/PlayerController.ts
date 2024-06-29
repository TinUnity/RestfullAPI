import express from 'express';
import bodyParser from 'body-parser';
import { verifyToken } from '../ThirdPartyFunction/Authentication';
import { responseData } from '../ThirdPartyFunction/ResponseData';
import { appDataSource } from '../index';
import { PlayerManager } from '../Entities/PlayerManagerDB';
import { User } from '../Entities/UserDB';

const controller = express();
controller.use(bodyParser.json());

controller.post('/create-player', async (req, res) => {
    try {
        const tokenAuthority = req.headers['authorization'] as string;
        const checkToken = await verifyToken(tokenAuthority);
        if (checkToken) {;
            const EntityManager = appDataSource.getMongoRepository(User)
            let requestBody = {
                'userId': req.body.userId,
                players: req.body.players,
            };
            const getUserId = await EntityManager.findOneBy({
                userId: requestBody.userId,
            })
            // if (requestBody) {
            //     let resData = new responseData();
            //     resData.message = "Bad Request";
            //     resData.status_code = 404;
            //     return res.setHeader('authorization', tokenAuthority).status(resData.status_code).send(resData);
            // }

            const getPlayerManager = appDataSource.getMongoRepository(PlayerManager)
            if (getUserId) {
                const getPlayerManager = await EntityManager.findOneBy({
                    userId: requestBody.userId,
                })
                if (getPlayerManager) {
                    getPlayerManager.userId = requestBody.userId;

                    await EntityManager.save(getPlayerManager);
                    return res.setHeader('authorization', tokenAuthority).status(200).send(JSON.parse(JSON.stringify(getPlayerManager)));
                }
                else {
                    const newPlayerManager = new PlayerManager();
                    newPlayerManager.userId = requestBody.userId;
                    newPlayerManager.players = requestBody.players;

                    await EntityManager.save(newPlayerManager);

                    return res.setHeader('authorization', tokenAuthority).status(200).send(JSON.parse(JSON.stringify(newPlayerManager)));
                }
            }
            else {
                let resData = new responseData();
                resData.message = "Bad Request";
                resData.status_code = 404;
                return res.setHeader('authorization', tokenAuthority).status(resData.status_code).send(resData);
            }

        }
        else {
            let resData = new responseData();
            resData.message = "Authority";
            resData.status_code = 401;

            return res.status(resData.status_code).send(resData);
        }
    } catch (error) {
        console.log(error);
    }
});

module.exports = controller;