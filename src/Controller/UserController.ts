import express from 'express';
import bodyParser from 'body-parser';
import { getMongoManager } from 'typeorm';
import { User } from '../Entities/UserDB';
import { responseData } from '../ThirdPartyFunction/ResponseData';
import { getEmailToString } from '../ThirdPartyFunction/RegularString';
import { encryptPassword, dencryptPassword, createHex, generateRandomString } from '../ThirdPartyFunction/encrypt';
import { createToken, verifyToken } from '../ThirdPartyFunction/Authentication';

const MailController = require('../Controller/MailController');
const controller = express();
controller.use(bodyParser.json());
controller.post('/register', async (req, res) => {
    try {
        const entityManager = getMongoManager();
        let userManager = {
            'gmail': req.body.gmail,
            'password': req.body.password,
            'username': req.body.username,
            'passwordConfirm': req.body.passwordConfirm
        }
        if (!getEmailToString(userManager.gmail)) {
            let resData = new responseData();
            resData.message = "Email Not Valid";
            resData.status_code = 200;
            return res.status(resData.status_code).send(resData);
        }
        if (!userManager.password || !userManager.username) {
            let resData = new responseData();
            resData.message = "Some fields are empty, please re-check";
            resData.status_code = 200;
            return res.status(resData.status_code).send(resData);
        }
        if (userManager.password != userManager.passwordConfirm) {
            let resData = new responseData();
            resData.message = "Password confirm Not Valid";
            resData.status_code = 200;
            return res.status(resData.status_code).send(resData);
        }
        const user = await entityManager.findOneBy(User, {
            gmail: userManager.gmail
        });
        if (!user) {
            const genPassword = await encryptPassword(userManager.password, 10);

            const UserDB = new User();
            UserDB.userId = generateRandomString();
            UserDB.gmail = userManager.gmail;
            UserDB.password = genPassword;
            UserDB.username = userManager.username;
            UserDB.isVerify = false;


            await entityManager.save(UserDB);

            const sendMail = await MailController.sendVerify(UserDB.gmail, req);
            if (sendMail) {
                let resData = new responseData();
                resData.message = "Please Confirm Verify Gmail";
                resData.status_code = 200;
                return await res.status(resData.status_code).send(resData);
            }
        }
        else {
            let resData = new responseData();
            resData.message = "Gmail Is Registed";
            resData.status_code = 200;
            return res.status(resData.status_code).send(resData);
        }
    } catch (err) {
        console.log(err);
    }
});

controller.post('/login', async (req, res) => {
    try {
        const entityManager = getMongoManager();
        let reqData = {
            'gmail': req.body.gmail,
            'password': req.body.password,
            'isVerify': req.body.isVerify,
        }

        if (!getEmailToString(reqData.gmail)) {
            let resData = new responseData();
            resData.message = "Email Not Valid";
            resData.status_code = 200;
            return res.status(resData.status_code).send(resData);
        } else {

            if (!reqData.password) {
                let resData = new responseData();
                resData.message = "Password is empty, please re-check";
                resData.status_code = 200;
                return res.status(resData.status_code).send(resData);
            }

            const getGmailDatabase = await entityManager.findOneBy(User, {
                gmail: reqData.gmail
            })

            if (getGmailDatabase) {
                if (!getGmailDatabase.isVerify) {
                    let resData = new responseData();
                    resData.message = "This gmail hasn't confirmed yet, please confirm";
                    resData.status_code = 200;

                    return res.status(resData.status_code).send(resData);
                } else {
                    const isValid = await dencryptPassword(reqData.password, getGmailDatabase?.password);
                    if (isValid) {
                        process.env.ACESS_TOKEN_SECRET = createHex();
                        const token = createToken(getGmailDatabase.userId);

                        return await res.setHeader('authorization', "token").status(200).send(JSON.parse(JSON.stringify(getGmailDatabase)));
                    } else {
                        let resData = new responseData();
                        resData.message = "Password is invalid, please re-check";
                        resData.status_code = 200;

                        return res.status(resData.status_code).send(resData);
                    }
                }
            }
            else {
                let resData = new responseData();
                resData.message = "Account doesn't exists";
                resData.status_code = 200;

                return res.status(resData.status_code).send(resData);
            }
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = controller;