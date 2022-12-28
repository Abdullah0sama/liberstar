import jwt from 'jsonwebtoken'
import { userRoles } from '../../../components/auth/auth.interface';


export interface authPayloadInterface {
    id: string | number,
    name: string,
    username: string,
    role: userRoles
}

export function generateToken(payload: authPayloadInterface, options: jwt.SignOptions = {}) {
    const token = jwt.sign(payload, process.env.TOKEN_SECRET!, options)
    return token;
}

export function verifiyToken(token: string) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.TOKEN_SECRET!, (err, decoded) => {
            if(err) return reject(err)
            return resolve(decoded)
        })
    }) 
}

