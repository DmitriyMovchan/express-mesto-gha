const card = require('../models/card');

const getCards = (req, res) => {
  card.find({})
    .then(cards => {
      res.status(200).send(cards);
    })
    .catch(err => {
      res.status(500).send({ message: 'Server error' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  if (!name || !link) {
    return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
  }
  const owner = req.user._id;

  card.create({ name, link, owner })
    .then(card => {
      res.status(201).send({ message: 'Card has been created' });
    })
    .catch(err => {
      res.status(500).send({ message: 'Server error' });
    });
};

const deleteCard = (req, res) => {
  card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.send({message: 'Карточка удалена'});
    });
};

const putLike = (req, res) => {
  card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      res.status(200).send({ message: 'лайк поставлен успешно' });
    })
    .catch(err => {
      console.log('err', err);
    });
};

const deleteLike = (req, res) => {
  card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } })
    .then((card) => {
      res.status(200).send({ message: 'лайк удален успешно' });
    })
    .catch(err => {
      console.log('err', err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  putLike,
  deleteLike,
};
