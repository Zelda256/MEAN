'use strict';

const passport = require('passport'),
  // url = require('url'),
  GitHubStrategy = require('passport-github').Strategy,
  config = require('../config'),
  users = require('../../app/controllers/users.server.controller');

module.exports = () => {
  // 注册 github 策略
  passport.use(new GitHubStrategy({
    clientID: config.github.clientID,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackURL,
    passRegToCallback: true,
    // proxy: true
  }, (req, accessToken, refreshToken, profile, done) => {
    let providerData = profile._json;
    providerData.accessToken = accessToken;
    providerData.refreshToken = refreshToken;

    // console.log(profile);

    let providerUserProfile = {
      firstName: profile.username,
      lastName: ' ',
      fullName: profile.displayName,
      email: profile.emails[0].value,
      username: profile.username,
      provider: 'github',
      providerId: profile.id,
      providerData: providerData,
    };

    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};