const router = require('express')
  .Router();

const {
  celebrate,
  Joi,
} = require('celebrate');

const {
  getInfoAboutMe,
  updateUserInfo,
} = require('../controllers/users');

router.get('/users/me', getInfoAboutMe);

router.patch('/users/me',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string()
          .min(2)
          .max(30),
        email: Joi.string()
          .email()
      }),
  }),
  updateUserInfo);

module.exports = router;
