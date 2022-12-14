import express  from "express"
import { ControllerInterface } from "../../common/ControllerInterface"
import { Validation } from "../../common/validation";
import { paramsValidation } from "../users/userValidation";
import { BookRepository } from "./bookRepository";
import { insertValidation, updateValidation } from "./bookValidation";

export class BookController extends ControllerInterface {
    bookRepository: BookRepository;

    constructor (app: express.Application) {
        super(app);
        this.bookRepository = new BookRepository();
    }

    configureRoutes(): express.Application {
        this.app.get('/books', async (req, res) => {
            const books = await this.bookRepository.getBooks();

            res.status(200).send({ data: books });
        });

        this.app.get('/books/:id', Validation(paramsValidation), async (req, res, next) => {
            try {
                const book = await this.bookRepository.getBookById(req.params.id);
                res.status(200).send({ data: book });
            } catch (err: any) {
                next(err)
            }
        });

        this.app.post('/books', Validation(insertValidation), async (req, res) => {
            const id = await this.bookRepository.insertBook(req.body);
            res.status(201).send({ data: { id }});
        });

        this.app.delete('/books/:id', Validation(paramsValidation), async (req, res) => {
            await this.bookRepository.deleteBookById(req.params.id);
            res.status(204).end();
        });

        this.app.patch('/books/:id', Validation(updateValidation), async (req, res, next) => {
            try {
                await this.bookRepository.updateBook(req.params.id, req.body);
                res.status(204).end();
            } catch (err: any) {
                next(err);
            }
        });

        return this.app;
    }
}