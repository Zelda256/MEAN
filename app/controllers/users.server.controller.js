'use strict';

const User = require('mongoose').model('User'),
  passport = require('passport');

// 处理Mongoose错误对象err并返回统一格式的错误消息
const getErrorMessage = (err) => {
  let message = '';
  if (err.code) {
    switch(err.code) {
    case 11000:
    case 11001:
      message = 'Username already exists';
      break;
    default:
      message = 'Something went wrong';
    }
  } else {
    for (let errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }
  return message;
};

exports.renderSignin = (req, res) => {
  if (!req.user) {
    res.render('signin', {
      title: 'Sign-in Form',
      messages: req.flash('error') || req.flash('info')
    });
  } else {
    return res.redirect('/');
  }
};

exports.renderSignup = (req, res) => {
  if (!req.user) {
    res.render('signup', {
      title: 'Sign-up Form',
      messages: req.flash('error')
    });
  } else {
    return res.redirect('/');
  }
};

exports.signup = (req, res, next) => {
  if (!req.user) {
    const user = new User(req.body);
    let message = null;

    user.provider = 'local';

    user.save((err) => {
      if (err) {
        message = getErrorMessage(err);

        req.flash('error', message);
        return res.redirect('/signup');
      }
      req.login(user, (err) => {
        if (err) return next(err);
        return res.redirect('/');
      });
    });
  } else {
    return res.redirect('/');
  }
};

exports.signout = (req, res) => {
  req.logout();
  res.redirect('/');
};

exports.saveOAuthUserProfile = (req, profile, done) => {
  User.findOne({
    provider: profile.provider,
    providerId: profile.providerId,
  }, (err, user) => {
    if (err) {
      return done(err);
    } else {
      if (!user) {
        let possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');

        User.findUniqueUsername(possibleUsername, null, (availableUsername) => {
          profile.username = availableUsername;

          user = new User(profile);

          user.save((err) => {
            if (err) {
              let message= this.getErrorMessage(err);
              req.flash('error', message);
              // return res.redirect('/signup');
            }
            return done(err, user);
          });
        });
      } else {
        return done(err, user);
      }
    }
  });
};

exports.create = (req, res, next) => {
  const user = new User(req.body);

  user.save((err) => {
    if (err) {
      return next(err);
    } else {
      res.json(user);
    }
  });
};

exports.list = (req, res, next) => {
  User.find({}, (err, users) => {
    if (err) {
      return next(err);
    } else {
      res.json(users);
    }
  });
};

exports.read = (req, res) => {
  res.json(req.user);
};

exports.userByID = (req, res, next, id) => {
  User.findOne({
    _id: id,
  }, (err, user) => {
    if (err) {
      return next(err);
    } else {
      req.user = user;
      next();
    }
  });
};

exports.update = (req, res, next) => {
  User.updateOne({_id: req.user.id}, req.body, (err, user) => {
    if (err) {
      return next(err);
    } else {
      res.json(user);
    }
  });
};

exports.delete = (req, res, next) => {
  req.user.remove(err => {
    if (err) {
      return next(err);
    } else {
      res.json(req.user);
    }
  });
};

exports.requiresLogin = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      message: 'User is not logged in'
    });
  }
  next();
};

