'use strict';

const users = require('../../app/controllers/users.server.controller'),
  articles = require('../../app/controllers/articles.server.controller');

module.exports = (app) => {
  app.route('/api/articles')
    .get(articles.list)
    .post(users.requiresLogin, articles.create);

  app.route('/api/articles/:articleId')
    .get(articles.read)
    .put(users.requiresLogin, articles.hasAuthorization, articles.update)
    .delete(users.requiresLogin, articles.hasAuthorization, articles.delete);

  app.params('articleId', articles.articleByID);
};