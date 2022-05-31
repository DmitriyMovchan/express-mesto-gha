const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET_KEY = '1234567890';
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '7d' });
};

const verifyToken = (token) => {
  let decoded;
  try {
    // eslint-disable-next-line no-unused-vars
    token = token.split(' ')[1];
    decoded = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    // eslint-disable-next-line new-cap
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject('token invalid');
  }
  return User.findOne({ _id: decoded._id })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (user) {
        return true;
      }
      throw new Error('user is not found');
    });
};

const isAuthorized = (req, res, next) => {
  let auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).send({ message: 'Требуется авторизация' });
  }
  let decoded;
  try {
    auth = auth.split(' ')[1];
    decoded = jwt.verify(auth, JWT_SECRET_KEY);
  } catch (err) {
    // eslint-disable-next-line new-cap
    // eslint-disable-next-line prefer-promise-reject-errors
    return res.status(401).send({ message: 'Требуется авторизация1' });
  }
  return User.findOne({ _id: decoded._id })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Требуется авторизация2' });
      }
      next();
    })
    .catch(() => res.status(500).send({ message: 'ЧТо-то сломалось' }));
};

module.exports = { generateToken, isAuthorized };
