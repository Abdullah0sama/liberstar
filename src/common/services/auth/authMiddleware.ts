
import express from 'express'
import { Forbidden, NotAuthorized } from '../../Errors'
import { authPayloadInterface, verifiyToken } from './auth'
import { ReviewRepositroy } from '../../../components/reviews/reviewRepository'
import { userRoles } from '../../../components/auth/auth.interface'

export async function validateAccessToken(req: express.Request, res: express.Response, next: express.NextFunction) {
    if(req.headers['authorization']) {
        try {
            const [ bearer, token ] = req.headers['authorization'].split(' ')
            if (bearer != 'Bearer') return next(new NotAuthorized())
            const jwt = await verifiyToken(token);
            req.auth = (jwt as authPayloadInterface)
            next()
        } catch (err) {
            next(new Forbidden())
        }

    } else {
        return next(new NotAuthorized())
    }
}

export function protectUser (req: express.Request, res: express.Response, next: express.NextFunction) {
    
    if (!req.auth) return next(new NotAuthorized())

    if ([userRoles.root].includes(req.auth.role)) return next();

    if (req.params.id != req.auth.id) {
        next(new Forbidden(`User '${req.auth.username}' is not authorized to perform such action!`))
    } else {
        next()
    }
}

export async function protectReview (req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.auth) return next(new NotAuthorized())
    
    if ([userRoles.admin, userRoles.root].includes(req.auth.role)) return next();
    const reviewRepository = new ReviewRepositroy(req.app.locals.logger);
    const review = await reviewRepository.getReviewById(req.params.id, {
        select: ['user_ref']
    })
    if (!review || review.user_ref != req.auth.id) 
        next(new Forbidden(`User '${req.auth.username}' is not authorized is not authorized to perform such action`))

    return next()
}

export async function protectBooks (req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.auth) return next(new NotAuthorized())

    if (![userRoles.admin, userRoles.root].includes(req.auth.role)) return next(new Forbidden())
    return next()
}