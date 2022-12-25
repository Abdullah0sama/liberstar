import express  from "express"
import { ControllerInterface } from "../../common/ControllerInterface"
import { Validation } from "../../common/validation";
import { paramsValidation } from "../users/userValidation";
import { BookRepository } from "./bookRepository";
import { getValidation, insertValidation, listingValidation, updateValidation } from "./bookValidation";
import { GetInterface, ListInterface } from "./bookInterface";
import { validateAccessToken } from "../../common/services/auth/authMiddleware";

export class BookController extends ControllerInterface {
    bookRepository: BookRepository;

    constructor (app: express.Application) {
        super(app);
        this.bookRepository = new BookRepository();
    }

    configureRoutes(): express.Application {
        this.app.get('/books', 
            Validation(listingValidation), 
            async (req, res, next) => {
                try {
                    const options: ListInterface = req.query;
                    const books = await this.bookRepository.getBooks(options);
                    res.status(200).send({ data: books });
                } catch(err: any) {
                    next(err);
                }
        });

        this.app.get('/books/:id', 
            Validation(getValidation), 
            async (req, res, next) => {
                try {
                    const options: GetInterface = req.query;
                    const book = await this.bookRepository.getBookById(req.params.id, options);
                    res.status(200).send({ data: book });
                } catch (err: any) {
                    next(err)
                }
        });

        this.app.post('/books', 
            validateAccessToken,
            Validation(insertValidation), 
            async (req, res) => {
                const id = await this.bookRepository.insertBook(req.body);
                res.status(201).send({ data: { id }});
        });

        this.app.delete('/books/:id', 
            validateAccessToken,
            Validation(paramsValidation), 
            async (req, res) => {
                await this.bookRepository.deleteBookById(req.params.id);
                res.status(204).end();
        });

        this.app.patch('/books/:id', 
            validateAccessToken,
            Validation(updateValidation), 
            async (req, res, next) => {
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