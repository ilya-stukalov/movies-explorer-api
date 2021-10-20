const bcrypt = require('bcrypt');

const Movie = require('../models/movie');

const { JWT_SECRET, NODE_ENV } = process.env;

const InvalidData = require('../errors/invalid-data');

const NotFoundError = require('../errors/not-found-error');

const Forbidden = require('../errors/forbidden-error');

const {
  STATUS_OK,
} = require('../utils/constants');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res
      .status(STATUS_OK)
      .send({ data: movies }))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => movie.populate('owner'))
    .then((movie) => res
      .status(STATUS_OK)
      .send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InvalidData(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const id = req.user._id;
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Нет фильма с таким id');
      }
      if (movie.owner.toString() !== id) {
        throw new Forbidden('Нет прав');
      }

      Movie.findByIdAndRemove(req.params.id)
        .then((deletedMovie) => {
          res.status(STATUS_OK)
            .send({ data: deletedMovie });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};
