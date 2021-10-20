const router = require('express')
  .Router();

const {
  celebrate,
  Joi,
} = require('celebrate');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies',
  celebrate({
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
          .regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
        trailer: Joi.string()
          .required()
          .regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
        thumbnail: Joi.string()
          .required()
          .regex(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
        owner: Joi.required(),
        movieId: Joi.required(),
        nameRU: Joi.string()
          .required(),
        nameEN: Joi.string()
          .required(),
      }),
  }),
  createMovie);

router.delete('/movies/:id', deleteMovie);

module.exports = router;
