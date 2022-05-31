const router = require('express').Router();
const {
  getUser,
  createUser,
  getUsers,
  updateProfile,
  updateAvatar,
  login,
} = require('../controllers/user');
const { isAuthorized } = require('../middlewares/auth');

router.post('/signup', createUser);
router.patch('/users/me', updateProfile);
router.post('/users', createUser);
router.get('/users', getUsers);
router.patch('/users/me/avatar', updateAvatar);
router.post('/signin', login);
router.get('/users/:id', isAuthorized, getUser);

module.exports.userRouter = router;
