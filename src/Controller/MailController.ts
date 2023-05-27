import nodemailer from 'nodemailer';
import express from 'express';
import bodyParser from 'body-parser';
import { getMongoManager } from 'typeorm';
import {User} from '../Entities/UserDB';
import {responseData} from '../ThirdPartyFunction/ResponseData';

var controller = express();
controller.use(bodyParser.json());
var rad;

function sendVerify(input: any, req) {
    rad = input;
    let link = "http://" + req.get('host') + "/api/v1/mail/verify-mail?id=" + rad;

    var transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: 'honguyenthanhtin17@gmail.com',
            pass: 'yfvywupoigcbaalf',
        }
    });

    var mailOptions = {
        from: 'Colyseus@gmail.com',
        to: input,
        subject: 'Confirmation Verify Gmail For Colyseus',
        text: 'You reveice a message from Colyseus@gmail.com',
        html: '<p>ColyseusYou requested for email verification, kindly use this <a href=' + link + '>link</a> to verify your email address</p>',
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Sent A Message' + info.response);
        }
    });
};

controller.get(`/verify-mail`, async (req, res) => {
    try {
        let entityManager = getMongoManager();
        if (req.query.id == rad) {
            const userSelected = await entityManager.findOneBy(User,{
                gmail: req.query.id 
            });

            if(userSelected){
                userSelected.isVerify = true;
                await entityManager.save(userSelected);
                
                let resData = new responseData();
                resData.message = "Gmail is confirmed verification";
                resData.status_code = 200;
                res.status(resData.status_code).send(resData);
            }
            else{
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
    }catch(err){
        console.log(err);
    }
})


module.exports = {
    controller: controller,
    sendVerify: sendVerify,
};