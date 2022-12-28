import express  from 'express'
import { ControllerInterface } from '../../common/ControllerInterface'
import { Validation } from '../../common/validation';
import { paramsValidation } from '../users/userValidation';
import { BookRepository } from './bookRepository';
import { getValidation, insertValidation, listingValidation, updateValidation } from './bookValidation';
import { GetInterface, ListInterface } from './bookInterface';
import { protectBooks, validateAccessToken } from '../../common/services/auth/authMiddleware';
import pino from 'pino';

export class BookController extends ControllerInterface {
    bookRepository: BookRepository;

    constructor (app: express.Application, logger: pino.Logger) {
        super(app, logger);        
        this.bookRepository = new BookRepository(logger);
    }

    configureRoutes(): express.Application {
        this.app.get('/books', 
            Validation(listingValidation), 
            async (req, res, next) => {
                try {
                    const options: ListInterface = req.query;
                    const books = await this.bookRepository.getBooks(options);
                    res.status(200).send({ data: books });
                } catch(err: unknown) {
                    this.logger.error(err, 'BookController GET /books')
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
                } catch (err: unknown) {
                    this.logger.error(err, 'BookController GET /books/:id')
                    next(err)
                }
        });

        this.app.post('/books', 
            validateAccessToken,
            protectBooks,
            Validation(insertValidation), 
            async (req, res, next) => {
                try {
                    const id = await this.bookRepository.insertBook(req.body);
                    res.status(201).send({ data: { id }});
                } catch (err) {
                    this.logger.error(err, 'BookController POST /books/')
                    next(err)
                }
        });

        this.app.delete('/books/:id', 
            validateAccessToken,
            protectBooks,
            Validation(paramsValidation), 
            async (req, res, next) => {
                try {
                    await this.bookRepository.deleteBookById(req.params.id);
                    res.status(204).end();
                } catch (err) {
                    this.logger.error(err, 'BookController DELETE /books/:id')
                    next(err)
                }
        });

        this.app.patch('/books/:id', 
            validateAccessToken,
            protectBooks,
            Validation(updateValidation), 
            async (req, res, next) => {
                try {
                    await this.bookRepository.updateBook(req.params.id, req.body);
                    res.status(204).end();
                } catch (err: unknown) {
                    this.logger.error(err, 'BookController PATCH /books/:id')
                    next(err);
                }
        });

        return this.app;
    }
}