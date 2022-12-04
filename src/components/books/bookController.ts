import express  from "express"
import { ControllerInterface } from "../../common/ControllerInterface"

export class BookController extends ControllerInterface {

    constructor (app: express.Application) {
        super(app);
    }

    configureRoutes(): express.Application {
        this.app.get('/books', (req, res) => {
            res.send('All books').status(200).end();
        });

        this.app.get('/book/:id', (req, res) => {
            res.send(`We Got ${req.params.id} Book here`);
        });

        this.app.post('/books', (req, res) => {
            console.log(req.body);
        });

        this.app.delete('/books/:id', (req, res) => {
            console.log('Delete book');
        });

        this.app.patch('/books/:id', (req, res) => {
            console.log('Book is updated')
        });

        return this.app;
    }
}