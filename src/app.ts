import * as dotenv from 'dotenv'
dotenv.config()

import express from "express";

const app = express();

app.get('/', (req, res) => {
    
    res.send('We are working!').status(200);
    res.end();

});

const s = app.listen((process.env.PORT || 3000), () => {

    console.log('Server has Started!', s.address()); 
});
