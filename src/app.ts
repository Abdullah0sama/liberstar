import * as dotenv from 'dotenv'
dotenv.config()

import { BookController } from './components/books/bookController';
import express from "express";
import { UserController } from './components/users/userControllers';
import { ReviewController } from './components/reviews/reviewController';
import { AuthController } from './components/auth/auth.controller';


export const app = express();
app.use(express.json())
function errorHandler(error: any, req: express.Request, res: express.Response, next: any) {
    if (error.statusCode) {
        res.status(error.statusCode).send({ error: error.message })
    } else {
        res.status(500).end()
    }
}

new BookController(app)
new UserController(app)
new ReviewController(app)
new AuthController(app)
app.use(errorHandler)

module.exports.app =  app;
// const server = http.createServer(app);
// server.listen((process.env.PORT || 3000), () => {

//     console.log('Server has Started!', server.address()); 
// });