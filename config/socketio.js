'use strict';

const config = require('./config'),
  cookieParser = require('cookie-parser'),
  passport = require('passport');

module.exports = (server, io, mongoStore) => {
  io.use((socket, next) => {
    cookieParser(config.sessionSecret)(socket.request, {}, (err) => {
      const sessionId = socket.request.signedCookies['connect.sid'];

      mongoStore.get(sessionId, (err,  session) => {
        socket.request.session = session;

        passport.initialize()(socket.request, {}, () => {
          passport.session()(socket.request, {}, () => {
            if (socket.request.user) {
              next(null, true);
            } else {
              next(new Error('User is not authenticated'), false);
            }
          });
        });
      });
    });
    
    io.on('connection', (socket) => {
      require('../app/controllers/chat.server.controller')(io, socket);
    });
  });
};