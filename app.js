require('dotenv').config();

const express = require('express');

const { DB_URL, NODE_ENV } = process.env;

const mongoose = require('mongoose');

const {
  errors,
} = require('celebrate');

const helmet = require('helmet');

const cors = require('cors');

const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const rateLimiter = require('./middlewares/rateLimiter');

const errorHandler = require('./middlewares/errorHandler');

const router = require('./routes/index');

const app = express();

app.use(cookieParser());

app.use(requestLogger);

app.use(helmet());

app.use(rateLimiter);

const {
  allowedCors,
} = require('./utils/constants');

app.use(cors({
  origin: allowedCors,
  credentials: true,
  sameSite: 'strict',
  secure: true,
  httpOnly: true
}));

const { PORT = 3000 } = process.env;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

mongoose.connect(NODE_ENV === 'production' ? DB_URL : 'mongodb://localhost:27017/bitfilmsdb');

app.use('/', router);

app.use(errors());

app.use(errorLogger);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
