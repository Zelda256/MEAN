const app = require('../../server.js'),
  should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Article = mongoose.model('Article');

let user, article;

describe('Article Model Unit Tests: ', () => {
  beforeEach((done) => {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@teset.com',
      username: 'username',
      password: 'password',
    });

    user.save(function(){
      article = new Article({
        title: 'Article title',
        content: 'Article Content',
        creator: user,
      });
      
      done();
      
    });
  });

  describe('Testing the save mothod', () => {
    it('Should be able to save without problems', () => {
      article.save((err) => {
        should.not.exist(err);
      });
    });

    it('Should not be able to save an article without a title', () => {
      article.title = '';

      article.save((err) => {
        should.exist(err);
      });
    });

    afterEach((done) => {
      Article.remove(function() {
        User.remove(function() {
          done();
        });
      });
    });

  });

});