var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var usersRouter = require('./routes/users');

var app = express();

// var cors = express('cors')
 
// app.use(cors)

app.all('*', function (req, res, next) {
  // res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials","true");
  res.header("X-Powered-By",' 3.2.1')
  if(req.method === "OPTIONS") res.send(200);/*让options请求快速返回*/
  else  next();
})

var indexRouter = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// 日志鉴权等中间件应该放在前面
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
// 需要在正常请求之后 否则会拦截正常请求
// next如果不是路径再问问跳到错误处理中间件
app.use(function(req, res, next) {
  next(createError(404));
});



process.on('uncaughtException', function(err) {
  console.log('uncaughtException', err)
})

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
})
module.exports = app;
