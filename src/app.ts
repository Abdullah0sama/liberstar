import * as dotenv from 'dotenv'
dotenv.config()

import { BookController } from './components/books/bookController';
import express from "express";
import * as http from 'http';

const app = express();
app.use(express.json())

function errorHandler(error: any, req: express.Request, res: express.Response, next: any) {

    if (error.statusCode) {
        res.send({ error: error.message }).status(error.statusCode).end()
    } else {
        res.status(500).end()
    }
}

new BookController(app)

app.use(errorHandler)
const server = http.createServer(app);
server.listen((process.env.PORT || 3000), () => {

    console.log('Server has Started!', server.address()); 
});