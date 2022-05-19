const router = require('express').Router();
const {
  getUser,
  createUser,
  getUsers,
} = require('../controllers/user');

router.get('/users/:id', getUser);

router.post('/users', createUser);

router.get('/users', getUsers);

module.exports.userRouter = router;
