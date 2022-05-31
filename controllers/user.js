const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateToken } = require('../middlewares/auth');

const MONGO_DUPLICATE_KEY_CODE = 11000;
const saltRounds = 10;

// eslint-disable-next-line consistent-return
const getUser = (req, res) => {
  return User.findOne({ id: req.params.id })
    .then((user) => {
      console.log({ id: req.body });
      if (!user) {
        return res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => res.status(500).send(err));
};

// eslint-disable-next-line consistent-return
const createUser = (req, res) => {
  const {
    name, about, avatar, password, email,
  } = req.body;
  if (!password || !email) {
    return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
  }
  bcrypt.hash(password, saltRounds)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => {
        res.status(201).send({ message: user });
      }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      console.log('err', err);
      if (err.code === MONGO_DUPLICATE_KEY_CODE) {
        return res.status(400).send({ message: 'Пользователь с таким емейлом уже есть.' });
      }
      res.status(500).send({ message: err.name });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
  // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        // return Promise.reject(new Error('Неправильные почта или пароль'));
        throw new Error('not found');
        // return res.status(400).send({ message: 'Email или пароль не верный' });
      }
      return {
        isPasswordValid: bcrypt.compare(password, user.password),
        user,
      };
    })
    // eslint-disable-next-line consistent-return
    .then(({ isPasswordValid, user }) => {
      if (!isPasswordValid) {
        return res.status(400).send({ message: 'Email или пароль не верный' });
      }
      return generateToken({ _id: user._id });
    })
    .then((token) => {
      res.status(200).send({ token });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.message === 'not found') {
        return res.status(400).send({ message: 'Email или пароль не верный!!!' });
      }
      return res.status(500).send({ message: 'что-то поломалось' });
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      res.status(500).send({ message: 'Server error' });
    });
};

// eslint-disable-next-line consistent-return
const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

// eslint-disable-next-line consistent-return
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
  }
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

const getMe = (req, res) => {
  const { _id } = req.user;
  return User.findById(_id)
    .then((user) => {
      console.log({ user });
      if (!user) {
        return res.status(404).send({ message: 'Нет пользователя с таким id' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => res.status(500).send(err));
};

module.exports = {
  getUser,
  createUser,
  getUsers,
  updateProfile,
  updateAvatar,
  login,
  getMe,
};

// 6285ffb56466a33763982e46 - id тестового пользователя
