import * as dotenv from 'dotenv'
dotenv.config()
import pino from 'pino'
import { BookController } from './components/books/bookController';
import express from 'express';
import { UserController } from './components/users/userControllers';
import { ReviewController } from './components/reviews/reviewController';
import { AuthController } from './components/auth/auth.controller';
import { HttpError } from './common/Errors';

const logger = pino({
    enabled: true
})

export const app = express();
app.use(express.json())
function errorHandler(error: unknown, req: express.Request, res: express.Response, next: express.NextFunction) {
    if (error instanceof HttpError && error.statusCode) {
        res.status(error.statusCode).send({ error: error.message })
    } else {
        res.status(500).end()
    }
}
app.locals.logger = logger
new BookController(app, logger)
new UserController(app, logger)
new ReviewController(app, logger)
new AuthController(app, logger)
app.use(errorHandler)

module.exports.app =  app;
// const server = http.createServer(app);
// server.listen((process.env.PORT || 3000), () => {

//     console.log('Server has Started!', server.address()); 
// });