import nodemailer from 'nodemailer';
import express from 'express';
import bodyParser from 'body-parser';
import { getMongoManager } from 'typeorm';
import { User } from '../Entities/UserDB';
import { responseData } from '../ThirdPartyFunction/ResponseData';

var controller = express();
controller.use(bodyParser.json());
var rad;

controller.get(`/verify-mail`, async (req, res) => {
    try {
        let entityManager = getMongoManager();
        if (req.query.id == rad) {
            const userSelected = await entityManager.findOneBy(User, {
                gmail: req.query.id
            });

            if (userSelected) {
                userSelected.isVerify = true;
                await entityManager.save(userSelected);

                let resData = new responseData();
                resData.message = "Gmail is confirmed verification";
                resData.status_code = 200;
                res.status(resData.status_code).send(resData);
            }
            else {
                let resData = new responseData();
                resData.message = "Bad Request";
                resData.status_code = 400;
                res.status(resData.status_code).send(resData);
            }

        } else {
            let resData = new responseData();
            resData.message = "Bad Request";
            resData.status_code = 400;
            res.status(resData.status_code).send(resData);
        }
    } catch (err) {
        console.log(err);
    }
})


module.exports = {
    controller: controller,
    rad : rad
}