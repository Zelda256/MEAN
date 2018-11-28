'use strict';

var mongoose = require('mongoose'),
  crypto = require('crypto'),
  Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    // index: true,  // 创建辅助索引
    match: [/.+\@.+\..+/, 'Please fill a valid e-mail address'],
  },
  username: {
    type: String,
    trim: true,   // 去掉两端空格
    unique: true, // 该字段唯一
    required: true,
  },
  password: {
    type: String,
    validate: [
      (password) => {
        return password.length >= 6;
      },
      'Password should be longer'
    ]
  },
  salt: {
    type: String,
  },
  provider: {  // 注册用户时所采用的Passport策略类型
    type: String,
    required: 'Provider is required',
  },
  providerId: String,  // 身份验证策略的用户标识符
  providerData: {},   // 存储从OAuth提供方获取的用户信息
  created: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ['Admin', 'Owner', 'User'],
  },
});

// 虚拟属性 动态计算文档属性，不需将fullName存储到文档中
UserSchema.virtual('fullName')
  .get(function() {
    return this.firstName + ' ' + this.lastName;
  })
  .set(function(fullName) {
    const splitName = fullName.split(' ');
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
  });

// 配置MongoDB文档在转换为JSON时也依然使用虚拟属性功能
UserSchema.set('toJSON', {
  getters: true, 
  virtuals: true,
});

// 预处理中间件
UserSchema.pre('save', function(next){
  if (this.password) {
    this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});
// 自定义实例方法
UserSchema.methods.hashPassword = function(password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha1').toString('base64');
};

UserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

// 自定义静态方法 创建用户名
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
  const _this = this;
  const possibleUsername = username + (suffix || '');

  _this.findOne({
    username: possibleUsername,
  }, function(err, user) {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
};

// 后置处理中间件
// UserSchema.post('save', function(next) {
//   if (this.isNew) {
//     console.log('A new user was created.');
//   } else {
//     console.log('A user updated its details.');
//   }
// });

mongoose.model('User', UserSchema, 'users');