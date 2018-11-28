'use strict';

module.exports = {
  db: 'mongodb://localhost/mean-book',
  sessionSecret : 'developmentSessionSecret',
  facebook: {
    clientID: '291788308124886',
    clientSecret: '3bc584b69ea2458263ff514d3852a5a1',
    callbackURL: 'http://localhost:3000/oauth/facebook/callback',
  },
  google: {
    clientID: '396621057418-sl8020v5upkotq0i7e4rt96hf3v9597o.apps.googleusercontent.com',
    clientSecret: 'KXmKAw33mt7wy6z4WAHjRjMS',
    callbackURL: 'http://localhost:3000/oauth/google/callback'
  }
};