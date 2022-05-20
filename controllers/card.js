const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      res.status(500).send({ message: 'Server error' });
    });
};

// eslint-disable-next-line consistent-return
const createCard = (req, res) => {
  const { name, link } = req.body;
  if (!name || !link) {
    return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
  }
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send({ message: card });
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      res.status(500).send({ message: 'Server error' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      res.send({ message: 'Карточка удалена' })
        // eslint-disable-next-line consistent-return
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return res.status(400).send({ message: 'Переданы некорректные данные при удалении карточки' });
          }
          res.status(400).send({ message: 'некорректный id карточки.' });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

const putLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'некорректный id карточки.' });
      }
      res.status(200).send({ message: card });
    })
    .catch(() => {
      res.status(400).send({ message: 'некорректный id карточки.' });
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } })
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        return res.status(400).send({ message: 'некорректный id карточки' });
      }
      res.status(200).send({ message: card });
    })
    // eslint-disable-next-line consistent-return
    .catch(() => {
      res.status(400).send({ message: 'некорректный id карточки' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
