const express = require('express');
const mongoose = require('mongoose');
const { userRouter } = require('./routes/user');
const { cardRouter } = require('./routes/card');

const app = express();

const { PORT = 3000 } = process.env;

app.use(express.json());
app.use((req, _, next) => {
  req.user = {
    _id: '6285ffb56466a33763982e46',
  };
  next();
});

app.post('/signin', userRouter);
app.post('/signup', userRouter);
app.use('/', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => res.status(404).send({ message: 'Запрашиваемая страница не найдена' }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  console.log(PORT);
});
