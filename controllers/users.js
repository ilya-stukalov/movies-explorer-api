const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { JWT_SECRET, NODE_ENV } = process.env;

const NotFoundError = require('../errors/not-found-error');

const NotAuthError = require('../errors/not-auth-error');

const UserExistError = require('../errors/user-exist-error');

const InvalidData = require('../errors/invalid-data');

const {
  STATUS_OK,
} = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res
      .status(STATUS_OK)
      .send({ data: users }));
};

module.exports.getInfoAboutMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(STATUS_OK)
        .send(user);
    })
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then(() => {
      res
        .status(STATUS_OK)
        .send({
          data: {
            name,
            email,
          },
        });
    })
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        throw new UserExistError('Пользователь с таким email существует');
      }
      if (err.name === 'ValidationError') {
        throw new InvalidData(err.message);
      }
      })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const {
    name,
    email,
  } = req.body;
  User.findByIdAndUpdate(req.user._id, {
    name,
    email,
  }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(STATUS_OK)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new UserExistError('Пользователь с таким email существует'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '1h' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: 'None',
          secure: true,
        })
        .status(STATUS_OK)
        .send({ message: 'Авторизация успешна!' });
    })
    .catch((err) => {
      throw new NotAuthError(err.message);
    })
    .catch(next);
};
