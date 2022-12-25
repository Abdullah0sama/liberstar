import jwt from 'jsonwebtoken'


export interface jwtPayloadInterface {

}
export function generateToken(payload: any, options: jwt.SignOptions = {}) {
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

