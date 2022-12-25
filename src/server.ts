import * as http from 'http';

import { app } from './app';

const server = http.createServer(app);
server.listen((process.env.PORT || 3000), () => {
    console.log('Server has Started!', server.address()); 
});