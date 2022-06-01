const express = require('express');
const mongoose = require('mongoose');
const { userRouter } = require('./routes/user');
const { cardRouter } = require('./routes/card');
const { isAuthorized } = require('./middlewares/auth');
const res = require('express/lib/response');

const app = express();

const { PORT = 3000 } = process.env;
app.use(express.json());

app.post('/signin', userRouter);
app.post('/signup', userRouter);

app.use(isAuthorized);
app.use('/', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => res.status(404).send({ message: 'Запрашиваемая страница не найдена' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send();
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  console.log(PORT);
});
