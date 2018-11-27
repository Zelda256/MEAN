'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const express = require('./config/express'),
  mongoose = require('./config/mongoose'),
  Passport = require('./config/passport');

const db = mongoose();
const app = express();
const passport = Passport();

app.listen(3000, () => console.log('Server running at http://localhost:3000/'));

module.exports = app;