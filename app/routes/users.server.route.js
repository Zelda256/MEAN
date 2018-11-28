'use strict';

const users = require('../../app/controllers/users.server.controller'),
  passport = require('passport');

module.exports = app => {
  app.route('/signup')
    .get(users.renderSignup)
    .post(users.signup);

  app.route('/signin')
    .get(users.renderSignin)
    .post(passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/signin',
      failureFlash: true,
    }));
  
  app.get('/signout', users.signout);

  app.get('/oauth/facebook', passport.authenticate('facebook', {
    // failWithError: true,
    failureRedirect: '/signin',
  }));

  app.get('/oauth/facebook/callback', passport.authenticate('facebook', {
    // failWithError: true,
    failureRedirect: '/signin',
    successRedirect: '/',
  }));

  app.get('/oauth/google', passport.authenticate('google', {
    // failWithError: true,
    failureRedirect: '/signin',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
  }));

  app.get('/oauth/google/callback', passport.authenticate('google', {
    // failWithError: true,
    failureRedirect: '/signin',
    successRedirect: '/',
  }));

  app.route('/users')
    .post(users.create)
    .get(users.list);

  app.route('/users/:userId')
    .get(users.read)
    .put(users.update)
    .delete(users.delete);

  app.param('userId', users.userByID);
};