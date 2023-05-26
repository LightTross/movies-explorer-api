const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const cors = require('cors');
const limiter = require('./middlewares/limiter');

const { router } = require('./routes');

const { serverError } = require('./middlewares/serverError');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/moviesdb' } = process.env;

const app = express();

mongoose.connect(MONGO_URL);

app.use(cors({
  credentials: true,
  origin: [
    'http://api.talalayeva.promovies.nomoredomains.rocks/',
    'https://api.talalayeva.promovies.nomoredomains.rocks/',
    'http://talalayeva.promovies.nomoredomains.rocks/',
    'https://talalayeva.promovies.nomoredomains.rocks/',
    'localhost:3000',
    'http://localhost:3000/',
    'https://localhost:3000/',
  ],
}));

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use(limiter);

app.use(requestLogger); // подключаем логгер запросов

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

router.use(errors());

app.use(serverError);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
