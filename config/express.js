'use strict';
const config = require('./config'),
  express = require('express'),
  morgan = require('morgan'),  // 提供简单的日志中间件
  compress = require('compression'),  // 提供相应内容的压缩功能
  bodyParser = require('body-parser'),  // 包含几个处理请求数据的中间件
  methodOverride = require('method-override'),  // 提供对HTTP DELETE和PUT两个遗留方法的支持
  session = require('express-session');  // 用session对Web应用访客的行为进行跟踪

module.exports = () => {
  const app = express();

  if (process.env.NODE_ENV === 'development') {  // 开发环境
    app.use(morgan('dev'));
  } else if (process.env.NODE_ENV === 'production') {   // 生成环境
    app.use(compress());
  }

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(methodOverride());

  // session中间件会为应用中所有的请求对象增加一个session对象
  // 通过这个session对象，可以设置/获取当前会话的任意属性
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret
  }));

  app.set('views', './app/views');  // 设置视图文件的存储目录
  app.set('view engine', 'ejs');  // 将ejs设置为默认的模板引擎

  require('../app/routes/index.server.route.js')(app);
  require('../app/routes/users.server.route.js')(app);

  app.use(express.static('./public'));  // 提供静态文件服务
  return app;
};