const express = require('express');
const app =  express();

const cors = require('cors');
const mongoose = require('mongoose');

const cardSetsRouter = require('./routes/cardsets');
const usersRouter = require('./routes/users');

const port = process.env.PORT;

app.use(cors());
app.use(express.json())

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
});
const connection = mongoose.connection;

connection.once('open', () => {
    console.log('Connected to database');
});

app.use('/cardsets', cardSetsRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})