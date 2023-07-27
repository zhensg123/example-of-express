var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var app = express();

const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')

// cors解决跨域问题
const cors = require('cors')

app.use(cors())

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



// 配置 swagger-jsdoc
const options = {
  definition: {
      // swagger 采用的 openapi 版本 不用改
      openapi: '3.0.0',
      // swagger 页面基本信息 自由发挥
      info: {
          title: 'Imooc API Server',
          version: '1.0.0',
      }
  },
  // 重点，指定 swagger-jsdoc 去哪个路由下收集 swagger 注释
  apis: [path.join(__dirname, '/routes/*.js')]
}

const swaggerSpec = swaggerJSDoc(options)

// 开放 swagger 相关接口，
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// 使用 swaggerSpec 生成 swagger 文档页面，并开放在指定路由
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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
