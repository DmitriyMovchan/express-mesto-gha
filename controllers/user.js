const fs = require('fs').promises;
const path = require('path');
const users = require('../data.json');
const user = require('../models/user');

const getUser = (req, res) => {
  const id = req.params.id;
  user.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'карточка или пользователь не найден.' });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(400).send({ message: 'Id is not correct' });
      }
      return res.status(500).send({ message: 'Server error' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    return res.status(400).send({ message: 'age or name are not correct' });
  }

  user.create({ name, about, avatar })
    .then(user => {
      res.status(201).send({ message: 'User has been created' });
    })
    .catch(err => {
      console.log('err', err);
    });
  console.log(typeof user);
};

const getUsers = (req, res) => {
  user.find({})
    .then(users => {
      res.status(200).send(users)
    })
    .catch(err => {
      res.status(500).send({ message: 'Server error' });
    });
};

module.exports = {
  getUser,
  createUser,
  getUsers,
};

// 6285ffb56466a33763982e46 - id тестового пользователя
