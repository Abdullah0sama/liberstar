import * as http from 'http';

import { createApp } from './app';
import { AuthController } from './components/auth/auth.controller';
import { UserController } from './components/users/userControllers';
import { BookController } from './components/books/bookController';
import { ReviewController } from './components/reviews/reviewController';

const { app, logger } = createApp({
    controllers: [
        AuthController,
        UserController,
        BookController,
        ReviewController
    ],
    loggerOptions: {
        enabled: true
    }
});

const server = http.createServer(app);
server.listen((process.env.PORT || 3000), () => {
    logger.info('Server has Started!', server.address()); 
});