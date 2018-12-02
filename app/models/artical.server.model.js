'use strict';

const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  creted: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
    default: '',
    required: 'Title cannot be blank'
  },
  content: {
    type: String,
    default: '',
    trim: true,
  },
  creator: {
    type: Schema.ObjectId,
    ref: 'User',
  },
});

mongoose.model('Article', ArticleSchema, 'articles');