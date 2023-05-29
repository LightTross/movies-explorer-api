const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const cors = require('cors');
const limiter = require('./middlewares/limiter');

const { router } = require('./routes');

const { serverError } = require('./middlewares/serverError');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { ServerCrash, PortListening } = require('./errors/messageErrors');

const { MONGO_URL, PORT } = require('./utils/config');

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

app.use(requestLogger); // подключаем логгер запросов

app.use(limiter);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(ServerCrash);
  }, 0);
});

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

router.use(errors());

app.use(serverError);

app.listen(PORT, () => {
  console.log(PortListening, PORT);
});
