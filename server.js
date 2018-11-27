'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const express = require('./config/express'),
  mongoose = require('./config/mongoose');

const db = mongoose();
const app = express();

app.listen(3000, () => console.log('Server running at http://localhost:3000/'));

module.exports = app;