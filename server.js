const express = require('express');
const app =  express();

const cors = require('cors');
const mongoose = require('mongoose');

const port = 3000;

app.use(cors());
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/memorize', {
    useNewUrlParser: true,
    useCreateIndex: true
});
const connection = mongoose.connection;

connection.once('open', () => {
    console.log('Connected to database');
});

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})