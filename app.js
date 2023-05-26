const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

/* // const { cors } = require('./middlewares/cors');
const cors = require('cors'); */

const { router } = require('./routes');

const { serverError } = require('./middlewares/serverError');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/moviesdb' } = process.env;

const app = express();

mongoose.connect(MONGO_URL);

/* // app.use(cors); // подключаем CORS
app.use(cors({
  credentials: true,
  origin: [
    'http://talalayeva.mesto.nomoredomains.monster',
    'https://talalayeva.mesto.nomoredomains.monster',
    'http://api.talalayeva.mesto.nomoredomains.monster',
    'https://api.talalayeva.mesto.nomoredomains.monster',
    'localhost:3000',
    'http://localhost:3000/',
    'https://localhost:3000/',
  ],
})); */

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

router.use(errors());

app.use(serverError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
