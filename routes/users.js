const router = require('express')
  .Router();

const {
  validateUpdateUserInfo,
} = require('../middlewares/validation');

const {
  getInfoAboutMe,
  updateUserInfo,
} = require('../controllers/users');

router.get('/users/me', getInfoAboutMe);

router.patch('/users/me', validateUpdateUserInfo, updateUserInfo);

module.exports = router;
