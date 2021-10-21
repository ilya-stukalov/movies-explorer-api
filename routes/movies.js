const router = require('express')
  .Router();

const {
  validateCreateMovie,
  validateDeleteMovie,
} = require('../middlewares/validation');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', validateCreateMovie, createMovie);

router.delete('/movies/:id', validateDeleteMovie, deleteMovie);

module.exports = router;
