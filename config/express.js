'use strict';
const config = require('./config'),
  http = require('http'),
  socketio = require('socket.io'),
  express = require('express'),
  morgan = require('morgan'),  // 提供简单的日志中间件
  compress = require('compression'),  // 提供相应内容的压缩功能
  bodyParser = require('body-parser'),  // 包含几个处理请求数据的中间件
  methodOverride = require('method-override'),  // 提供对HTTP DELETE和PUT两个遗留方法的支持
  session = require('express-session'),  // 用session对Web应用访客的行为进行跟踪
  MongoStore = require('connect-mongo')(session),
  flash = require('connect-flash'),
  passport = require('passport');

module.exports = (db) => {
  const app = express();
  const server = http.createServer(app);
  const io = socketio.listen(server);

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

  const mongoStore = new MongoStore({
    url: config.db
  });
  // session中间件会为应用中所有的请求对象增加一个session对象
  // 通过这个session对象，可以设置/获取当前会话的任意属性
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    store: mongoStore
  }));

  app.set('views', './app/views');  // 设置视图文件的存储目录
  app.set('view engine', 'ejs');  // 将ejs设置为默认的模板引擎

  app.use(flash());
  app.use(passport.initialize());   // 启动passport模块
  app.use(passport.session());  // 追踪用户会话
  app.use(express.static('./public'));  // 提供静态文件服务


  require('../app/routes/index.server.route.js')(app);
  require('../app/routes/users.server.route.js')(app);
  require('../app/routes/articles.server.route')(app);

  require('./socketio')(server, io, mongoStore);

  return server;
};