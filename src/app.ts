import * as dotenv from 'dotenv'
dotenv.config()

import { BookController } from './components/books/bookController';
import express from "express";
import * as http from 'http';

const app = express();
app.use(express.json())

new BookController(app)

const server = http.createServer(app);
server.listen((process.env.PORT || 3000), () => {

    console.log('Server has Started!', server.address()); 
});