const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');
const users = require('./data.json');
const { userRouter } = require('./routes/user');

const app = express();

const { PORT = 3000 } = process.env;

app.use(express.json());
app.use((req, _, next) => {
  req.user = {
    _id: '6285ffb56466a33763982e46',
  };

  console.log(req.user);

  next();
});
app.use('/', userRouter);

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
