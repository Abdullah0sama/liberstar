import express  from "express"
import { ControllerInterface } from "../../common/ControllerInterface"
import { BookRepository } from "./bookRepository";

export class BookController extends ControllerInterface {
    bookRepository: BookRepository;

    constructor (app: express.Application) {
        super(app);
        this.bookRepository = new BookRepository();
    }

    configureRoutes(): express.Application {
        this.app.get('/books', async (req, res) => {
            const books = await this.bookRepository.getBooks();

            res.send({ data: books }).status(200).end();
        });

        this.app.get('/book/:id', async (req, res, next) => {
            try {
                const book = await this.bookRepository.getBookById(req.params.id);
                res.send({ data: book }).status(200).end();
            } catch (err: any) {
                next(err)
            }
        });

        this.app.post('/books', async (req, res) => {
            const id = await this.bookRepository.insertBook(req.body);
            res.send({ data: { id }}).status(201).end();
        });

        this.app.delete('/books/:id', async (req, res) => {
            await this.bookRepository.deleteBookById(req.params.id);
            res.status(204).end();
        });

        this.app.patch('/books/:id', async (req, res) => {
            await this.bookRepository.updateBook(req.params.id, req.body);
            res.status(204).end();
        });

        return this.app;
    }
}