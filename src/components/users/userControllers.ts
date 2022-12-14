import { ControllerInterface } from "../../common/ControllerInterface"
import express  from 'express'
import { UserRepository } from "./userRepository";
import { Validation } from '../../common/validation';
import { insertUser, paramsValidation, updateUserValidation } from "./userValidation";
export class UserController extends ControllerInterface {

    userRepository: UserRepository;

    constructor(app: express.Application) {
        super(app);
        this.userRepository = new UserRepository();
    }
    
    configureRoutes(): express.Application {
        
        this.app.get('/users', async (req, res, next) => {
            try {
                const users = await this.userRepository.getUsers();
            } catch (err: any) {
                next(err);
            }
        })

        this.app.get('/users/:id', Validation(paramsValidation), async (req, res, next) => {
            try {
                const user = await this.userRepository.getUserById(req.params.id);
                res.status(200).send({ data: user });
            } catch (err: any) {
                next(err);
            }
        })

        this.app.post('/users/', Validation(insertUser), async (req, res, next) => {
            try {
                const id = await this.userRepository.insertUser(req.body);
                res.status(201).send({ data: { id }});
            } catch (err: any) {
                next(err);
            }
        })

        this.app.patch('/users/:id', Validation(updateUserValidation), async (req, res, next) => {
            try {
                await this.userRepository.updateUser(req.params.id, req.body);
                res.status(204).end();
            } catch (err: any) {
                next(err);
            }
        });

        this.app.delete('/users/:id', Validation(paramsValidation), async (req, res, next) => {
            try {
                await this.userRepository.deleteUser(req.params.id);
                res.status(204).end();
            } catch (err: any) {
                next(err);
            }
        });

        return this.app;
    }
}