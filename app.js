const express = require('express');
const mongoose = require('mongoose');
const { userRouter } = require('./routes/user');
const { cardRouter } = require('./routes/card');
const { isAuthorized } = require('./middlewares/auth');

const app = express();

const { PORT = 3000 } = process.env;
app.use(express.json());

app.post('/signin', userRouter);
app.post('/signup', userRouter);

app.use(isAuthorized);
app.use('/', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => res.status(404).send({ message: 'Запрашиваемая страница не найдена' }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  console.log(PORT);
});
