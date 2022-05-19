const router = require('express').Router();
const {
  getUser,
  createUser,
  getUsers,
  updateProfile,
  updateAvatar,
} = require('../controllers/user');

router.get('/users/:id', getUser);
router.patch('/users/me', updateProfile);
router.post('/users', createUser);
router.get('/users', getUsers);
router.patch('/users/me/avatar', updateAvatar);

module.exports.userRouter = router;
