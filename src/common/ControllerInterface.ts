import express from 'express';

export abstract class ControllerInterface {
    app: express.Application;

    constructor (app: express.Application) {
        this.app = app;
        this.configureRoutes();
    }

    abstract configureRoutes(): express.Application;
}