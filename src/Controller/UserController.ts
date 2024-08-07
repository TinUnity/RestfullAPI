import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import { User } from '../Entities/UserDB';
import { responseData } from '../ThirdPartyFunction/ResponseData';
import { getEmailToString } from '../ThirdPartyFunction/RegularString';
import { encryptPassword, dencryptPassword, createHex, generateRandomString } from '../ThirdPartyFunction/encrypt';
import { createToken, verifyToken } from '../ThirdPartyFunction/Authentication';

var radMail = require('../Controller/MailController');
const appDataSource = require('./ConnectDatabaseController');
const controller = express();
controller.use(bodyParser.json());

controller.post('/register', async (req, res) => {
    try {
        const entityManager = appDataSource.getMongoRepository(User)
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
        const user = await entityManager.findOneBy({
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

            radMail.setRad(UserDB.gmail);
            let link = "http://" + req.get('host') + "/api/v1/mail/verify-mail?id=" + UserDB.gmail;

            const transporter = nodemailer.createTransport({
                service: "Gmail",
                host: 'smtp.gmail.com',
                auth: {
                    user: 'honguyenthanhtin17@gmail.com',
                    pass: 'yfvywupoigcbaalf',
                },
                secure: true,
            });

            const mailOptions = {
                from: 'Colyseus@gmail.com',
                to: UserDB.gmail,
                subject: 'Confirmation Verify Gmail For Colyseus',
                text: 'You reveice a message from Colyseus@gmail.com',
                html: '<p>ColyseusYou requested for email verification, kindly use this <a href=' + link + '>link</a> to verify your email address</p>',
            };

            await new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log(err);
                        reject(err);
                        let resData = new responseData();
                        resData.message = "Can't Send A Verify Mail";
                        resData.status_code = 400;
                        return res.status(resData.status_code).send(resData);
                    } else {
                        console.log('Sent A Message' + info.response);
                        resolve(info);
                        let resData = new responseData();
                        resData.message = "Please Confirm Verify Gmail";
                        resData.status_code = 200;
                        return res.status(resData.status_code).send(resData);
                    }
                });
            });

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
        const entityManager = appDataSource.getMongoRepository(User)
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

            const getGmailDatabase = await entityManager.findOneBy({
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
                        const token = await createToken(getGmailDatabase.userId);

                        return res.setHeader('authorization', token).status(200).send(JSON.parse(JSON.stringify(getGmailDatabase)));
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