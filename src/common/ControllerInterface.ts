import express from 'express';
import pino from 'pino';

export abstract class ControllerInterface {
    app: express.Application;
    logger: pino.BaseLogger

    constructor (app: express.Application, logger: pino.Logger) {
        this.app = app;
        this.logger = logger
        this.configureRoutes();
    }

    abstract configureRoutes(): express.Application;
}