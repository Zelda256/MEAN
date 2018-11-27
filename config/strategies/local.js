'use strict';

const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('mongoose').model('User');

module.exports = () => {
  // 注册local策略
  passport.use(new LocalStrategy( (username, password, done) => {
    User.findOne({
      username
    }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message: 'Unknown user',
        });
      }
      if (!user.authenticate(password)) {
        return done(null, false, {
          message: 'Invalid password',
        });
      }
      // 鉴权成功
      return done(null, user);
    });
  }));
};