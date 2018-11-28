'use strict';

const passport = require('passport'),
  url = require('url'),
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  config = require('../config'),
  users = require('../../app/controllers/users.server.controller');

module.exports = () => {
  // 注册 google 策略
  passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL,
    passRegToCallback: true,
    proxy: true
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
      provider: 'google',
      providerId: profile.id,
      providerData: providerData,
    };

    users.saveOAuthUserProfile(req, providerUserProfile, done);
  }));
};