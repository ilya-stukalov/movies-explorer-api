const router = require('express')
  .Router();

const {
  validateCreateUser,
  validateLogin,
} = require('../middlewares/validation');

const {
  createUser,
  login,
} = require('../controllers/users');

const auth = require('../middlewares/auth');

const userRouter = require('./users');

const movieRouter = require('./movies');

const otherRouter = require('./otherRoutes');

router.post('/signin', validateLogin, login);

router.post('/signup', validateCreateUser, createUser);

router.use(auth);

router.use('/', userRouter);

router.use('/', movieRouter);

router.get('/logout', (req, res) => res
  .clearCookie('jwt')
  .status(200)
  .json({ message: 'Successfully logged out 😏 🍀' }));

router.use('*', otherRouter);

module.exports = router;
