import express from 'express';
import { ControllerInterface } from '../../common/ControllerInterface';
import { Validation } from '../../common/validation';
import { authValidation } from './auth.validation';
import { CredentialsInterface } from './auth.interface';
import { AuthService } from './auth.service';
import pino from 'pino';

export class AuthController extends ControllerInterface {
    authService: AuthService;

    constructor(app: express.Application, logger: pino.Logger) {
        super(app, logger)
        this.authService = new AuthService(logger)
    }

    configureRoutes(): express.Application {
        
        this.app.post('/auth/', 
            Validation(authValidation), 
            async (req, res, next) => {
                const cred: CredentialsInterface = req.body;
                try {
                    const token = await this.authService.passwordAuthentication(cred)
                    res.status(200).send({ accessToken: token })
                } catch(err) {
                    next(err)
                }
        })

        return this.app
    }
}