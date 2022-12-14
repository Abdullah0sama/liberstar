import { ControllerInterface } from '../../common/ControllerInterface'
import express  from 'express'
import { UserRepository } from './userRepository';
import { Validation } from '../../common/validation';
import { getValidation, insertUser, listingValidation, paramsValidation, updateUserValidation } from './userValidation';
import { GetInterface, ListInterface } from './userInterface';
import { PasswordHash } from '../../common/services/auth/utils';
import { protectUser, validateAccessToken } from '../../common/services/auth/authMiddleware';
import pino from 'pino';
export class UserController extends ControllerInterface {

    userRepository: UserRepository;

    constructor(app: express.Application, logger: pino.Logger) {
        super(app, logger);
        this.userRepository = new UserRepository(logger);
    }
    
    configureRoutes(): express.Application {
        
        this.app.get('/users', 
            Validation(listingValidation), 
            async (req, res, next) => {
                try {
                    const options: ListInterface = req.query;
                    const users = await this.userRepository.getUsers(options);
                    res.status(200).send({ data: users });
                } catch (err: unknown) {
                    next(err);
                }
        })

        this.app.get('/users/:id', 
            Validation(getValidation), 
            async (req, res, next) => {
                try {
                    const options: GetInterface = req.query;
                    const user = await this.userRepository.getUserById(req.params.id, options);
                    res.status(200).send({ data: user });
                } catch (err: unknown) {
                    next(err);
                }
        })

        this.app.post('/users/', 
            Validation(insertUser), 
            async (req, res, next) => {
                try {
                    req.body.password = await PasswordHash.hash(req.body.password)
                    const id = await this.userRepository.insertUser(req.body);
                    res.status(201).send({ data: { id }});
                } catch (err: unknown) {
                    next(err);
                }
        })

        this.app.patch('/users/:id', 
            validateAccessToken,
            protectUser,
            Validation(updateUserValidation), 
            async (req, res, next) => {
                try {
                    if(req.body.password) req.body.password = await PasswordHash.hash(req.body.password)
                    await this.userRepository.updateUser(req.params.id, req.body);
                    res.status(204).end();
                } catch (err: unknown) {
                    next(err);
                }
        });

        this.app.delete('/users/:id', 
            validateAccessToken,
            protectUser,
            Validation(paramsValidation), 
            async (req, res, next) => {
                try {
                    await this.userRepository.deleteUser(req.params.id);
                    res.status(204).end();
                } catch (err: unknown) {
                    next(err);
                }
        });

        return this.app;
    }
}