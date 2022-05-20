const User = require('../models/user');

const getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'пользователь не найден.' });
      }
      res.status(200).send({ message: user });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(400).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

// eslint-disable-next-line consistent-return
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
  }
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send({ message: user });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      res.status(500).send({ message: 'Server error' });
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
  if (!name || !about) {
    return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
  }
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then(() => res.status(200).send({ message: name, about }))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(500).send({ message: 'Server error' });
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

module.exports = {
  getUser,
  createUser,
  getUsers,
  updateProfile,
  updateAvatar,
};

// 6285ffb56466a33763982e46 - id тестового пользователя
