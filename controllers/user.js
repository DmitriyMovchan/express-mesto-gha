const user = require('../models/user');

const getUser = (req, res) => {
  const { id } = req.params;
  user.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'пользователь не найден.' });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
  }
  user.create({ name, about, avatar })
    .then(user => {
      res.status(201).send({ message: 'User has been created' });
    })
    .catch(err => {
      res.status(500).send({ message: 'Server error' });
    });
};

const getUsers = (req, res) => {
  user.find({})
    .then(users => {
      res.status(200).send(users);
    })
    .catch(err => {
      res.status(500).send({ message: 'Server error' });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  if (!name || !about) {
    return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
  }
  user.findByIdAndUpdate(req.user._id, { name, about })
    .then(user => res.status(200).send({ message: 'Информация успешно обновлена' }))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
  }
  user.findByIdAndUpdate(req.user._id, { avatar })
    .then(user => res.status(200).send({ message: 'Аватар успешно обновлен' }))
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
