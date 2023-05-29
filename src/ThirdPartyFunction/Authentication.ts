import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { responseData } from './ResponseData';

async function createToken(idUser) {
    try {
        const AccessToken = await jwt.sign(idUser, process.env.ACESS_TOKEN_SECRET);
        return AccessToken;
    } catch (error) {
        console.log(error);
    }
}

async function verifyToken(token) {
    try {
        if(!token)
            return false;
        const tokenAccess = await jwt.verify(token, process.env.ACESS_TOKEN_SECRET);
        if (tokenAccess) {
            return true;
        } else {
            let resData = new responseData();
            resData.message = "Authority Invalid";
            resData.status_code = 404;

            return false;
        }
    } catch (error) {
        console.log(error);
    }
}


export { createToken, verifyToken }