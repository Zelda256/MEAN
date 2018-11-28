'use strict';

const passport = require('passport'),
  url = require('url'),
  FacebookStrategy = require('passport-facebook').Strategy,
  config = require('../config'),
  users = require('../../app/controllers/users.server.controller');

module.exports = () => {
  // 注册facebook策略
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL,
    passRegToCallback: true,
    // proxy: true
  }, (req, accessToken, refreshToken, profile, done) => {
    let providerData = profile._json;
    providerData.accessToken = accessToken;
    providerData.refreshToken = refreshToken;

    let providerUserProfile = {
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      fullName: profile.displayName,
      email: profile.emails[0].value,
      username: profile.username,
      provider: 'facebook',
      providerId: profile.id,
      providerData: providerData,
    };

    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};