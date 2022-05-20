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
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.send({ message: 'Карточка удалена' });
    });
};

const putLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      res.status(200).send({ message: card });
    })
    .catch(() => {
      res.send({ message: 'лайк поставлен' });
    });
};

const deleteLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } })
    .then((card) => {
      res.status(200).send({ message: card });
    })
    .catch(() => {
      res.send({ message: 'лайк удален' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
