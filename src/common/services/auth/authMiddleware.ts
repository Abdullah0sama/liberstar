
import express from 'express'
import { Forbidden, NotAuthorized } from '../../Errors'
import { verifiyToken } from './auth'

export async function authenticationMiddleWare(req: express.Request, res: express.Response, next: express.NextFunction) {
    if(req.headers['authorization']) {
        try {
            const [ bearer, token ] = req.headers['authorization'].split(' ')
            if (bearer != 'Bearer') return next(new NotAuthorized())
            const jwt = await verifiyToken(token);
            req.auth = jwt
            next()
        } catch (err) {
            next(new Forbidden())
        }

    } else {
        return next(new NotAuthorized())
    }
}