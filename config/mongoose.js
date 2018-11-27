'use strict';

const config = require('./config'),
  mongoose = require('mongoose');

module.exports = () => {
  const db = mongoose.connect(config.db, { useCreateIndex: true, useNewUrlParser: true });

  require('../app/models/user.server.model');  // 注册User模型

  return db;
};