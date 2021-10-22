const {
  celebrate,
  Joi,
  CelebrateError,
} = require('celebrate');

const isURL = require('validator/lib/isURL');

const {
  BAD_URL,
} = require('../utils/constants');

const urlValidator = (value) => {
  if (!isURL(value)) {
    throw new CelebrateError(`${value} ${BAD_URL}`);
  }
  return value;
};

const validateUpdateUserInfo = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .min(2)
        .max(30)
        .required(),
      email: Joi.string()
        .email()
        .required(),
    }),
});

const validateCreateMovie = celebrate({
  body: Joi.object()
    .keys({
      country: Joi.string()
        .required(),
      director: Joi.string()
        .required(),
      duration: Joi.number()
        .required(),
      year: Joi.string()
        .required(),
      description: Joi.string()
        .required(),
      image: Joi.string()
        .required()
        .custom(urlValidator),
      trailer: Joi.string()
        .required()
        .custom(urlValidator),
      thumbnail: Joi.string()
        .required()
        .custom(urlValidator),
      movieId: Joi.number()
        .required(),
      nameRU: Joi.string()
        .required(),
      nameEN: Joi.string()
        .required(),
    }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateDeleteMovie = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});

module.exports = {
  validateUpdateUserInfo,
  validateCreateMovie,
  validateCreateUser,
  validateLogin,
  validateDeleteMovie,
};
