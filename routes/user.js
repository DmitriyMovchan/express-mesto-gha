const router = require('express').Router();
const {
  getUser,
  createUser,
  getUsers,
  updateProfile,
  updateAvatar,
  login,
} = require('../controllers/user');

router.post('/signup', createUser);
router.get('/users/:id', getUser);
router.patch('/users/me', updateProfile);
router.post('/users', createUser);
router.get('/users', getUsers);
router.patch('/users/me/avatar', updateAvatar);
router.post('/', login);

module.exports.userRouter = router;
