'use strict';

exports.render = (req, res) => {
  res.render('index', {
    title:'Hello World',
  });
};