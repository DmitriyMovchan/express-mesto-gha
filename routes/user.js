const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  createUser,
  getUsers,
  updateProfile,
  updateAvatar,
  login,
  getMe,
} = require('../controllers/user');
const { isAuthorized } = require('../middlewares/auth');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    // eslint-disable-next-line no-undef
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    avatar: Joi.string().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
  }),
}), createUser);
router.post('/signin', login);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);
router.post('/users', createUser);
router.get('/users', getUsers);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/),
  }),
}), updateAvatar);
router.get('/users/me', isAuthorized, getMe);
router.get('/users/:id', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), isAuthorized, getUser);

module.exports.userRouter = router;
