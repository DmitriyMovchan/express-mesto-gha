const router = require('express').Router();
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

router.post('/signup', createUser);
router.post('/signin', login);
router.patch('/users/me', updateProfile);
router.post('/users', createUser);
router.get('/users', getUsers);
router.patch('/users/me/avatar', updateAvatar);
router.get('/users/me', isAuthorized, getMe);
router.get('/users/:id', isAuthorized, getUser);

module.exports.userRouter = router;
