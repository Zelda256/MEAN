const app = require('../../server'),
  request = require('supertest'),
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

      article.save((err) => {
        done();
      });
    });
  });

  describe('Testing the GET mothod', () => {
    it('Should be able to get the list of articles', (done) => {
      request(app).get('/api/articles/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          res.body.should.be.an.instanceOf(Array).and.have.lengthOf(1);
          res.body[0].should.have.property('title', article.title);
          res.body[0].should.have.property('content', article.content);

          done();
        });
    });

    it('Should be able to get the specific article', (done) => {
      request(app).get('/api/articles/' + article.id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          res.body.should.be.an.instanceOf(Object).and.have.property('title', article.title);
          res.body.should.have.property('content', article.content);

          done();
        });
    });

    afterEach((done) => {
      Article.remove().exec();
      User.remove().exec();
      done();
    });
  });

});