'use strict';

const mongoose = require('mongoose'),
  Article = mongoose.model('Article');
  
const getErrorMessage = (err) => {
  if (err.errors) {
    for (let errName in err.errors) {
      if (err.errors[errName].message) return err.errors[errName].message;
    }
  } else {
    return 'Unknoen server error';
  }
};

exports.create = (req, res) => {
  const article = new Article(req.body);
  article.creator = req.user;

  article.save(err => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

exports.list = (req, res) => {
  Article.find().sort('-created').populate('creator', 'firstName lastName fullName')
    .exec((err, articles) => {
      if (err) {
        return res.status(400).send({
          message: getErrorMessage(err)
        });
      } else {
        res.json(articles);
      }
    });
};

exports.articleByID = (req, res, next, id) => {
  Article.findById({_id: id}).populate('creator', 'firstName lastName fullName')
    .exec((err, article) => {
      if (err) {
        return next(err);
      }
      if (!article) {
        return next(new Error('Failed to load article ' + id));
      }
      req.article = article;
      next();
    });
};

exports.read = (req, res) => {
  res.json(req.article);
};

exports.update = (req, res) => {
  const article = req.article;

  article.title = req.body.title;
  article.content = req.body.content;

  article.save(err => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

exports.delete = (req, res) => {
  const article = req.article;

  article.remove((err) => {
    if (err) {
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      res.json(article);
    }
  });
};

exports.hasAuthorization = (req, res, next) => {
  if (req.article.creator.id !== req.use.id) {
    return res.status(403).send({
      message: 'User is not authorized'
    });
  }
};