const express = require('express');

const app = express();

require('dotenv').config();

const rateLimit = require('express-rate-limit');

const mongoose = require('mongoose');

const { PORT = 3001 } = process.env;

const {
  celebrate,
  Joi,
  errors,
} = require('celebrate');

const cookieParser = require('cookie-parser');

app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
});

app.use(limiter);

const bodyParser = require('body-parser');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const auth = require('./middlewares/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(requestLogger);

const {
  createUser,
  login,
} = require('./controllers/users');

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.post('/signin',
  celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
  }), login);

app.post('/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser);

app.use(auth);

app.use('/', require('./routes/users'));

app.use('/', require('./routes/movies'));

app.get('/logout', (req, res) => res
  .clearCookie('jwt')
  .status(200)
  .json({ message: 'Successfully logged out 😏 🍀' }));

app.use('*', require('./routes/otherRoutes'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use(errors());

app.use(errorLogger);

app.use((err, req, res, next) => {
  const {
    statusCode = 500,
    message,
  } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});
