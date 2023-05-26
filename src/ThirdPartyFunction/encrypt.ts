import bcrypt from 'bcryptjs';
import crypto from 'crypto';

async function encryptPassword(password, saltRound) {
    try {
        const hash = await bcrypt.hash(password, saltRound);
        return hash;
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function dencryptPassword(password, cryptPassword) {
    try {
        const isValid = bcrypt.compare(password, cryptPassword);
        return isValid;
    }
    catch (err) {
        console.error(err);
        return null;
    }
}

function createHex() {
    try {
        const hex = crypto.randomBytes(64).toString('hex');
        return hex;
    } catch (error) {
        console.log(error);
    }
}

function generateRandomString() {
    const length = 10;
    const buffer = crypto.randomBytes(length);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charLength = chars.length;
    let result = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = buffer[i] % charLength;
      result += chars.charAt(randomIndex);
    }
  
    return result;
  }
export { encryptPassword, dencryptPassword, createHex, generateRandomString };