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
// eslint-disable-next-line no-shadow
app.use('*', (req, res) => res.status(404).send({ message: 'Запрашиваемая страница не найдена' }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  console.log(PORT);
});
