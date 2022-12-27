import * as dotenv from 'dotenv'
dotenv.config()
import pino from 'pino'
import express from 'express';
import { HttpError } from './common/Errors';
import { ControllerBase } from './common/ControllerInterface'

export function createApp(options: optionsInterface): { app: express.Application, logger: pino.Logger } {
    
    const logger = pino(options.loggerOptions)
    const app = express();
    app.use(express.json())
    app.locals.logger = logger
    options.controllers.forEach(controllerClass => {
        const controller = new controllerClass(app, logger)
    });
    app.use(errorHandler)
    return { app, logger };
}

function errorHandler(error: unknown, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (error instanceof HttpError && error.statusCode) {
        res.status(error.statusCode).send({ error: error.message })
    } else {
        res.status(500).end()
    }
}
interface optionsInterface {
    controllers: ControllerBase[],
    loggerOptions: pino.LoggerOptions
}

