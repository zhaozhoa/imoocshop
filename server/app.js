var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var goodsRouter = require("./routes/goods")

var ejs = require('ejs')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express)
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 设立拦截器，拦截没有登陆的访问

app.use((req, res, next) => {
  if (req.cookies.userId) {
    next()
  } else if (req.originalUrl.indexOf('/users/login') != -1 || req.originalUrl.indexOf('/goods/list') != -1) {
    next()
  } else {
    res.json({
      status: '10001',
      msg: '未登录',
      result: ''
    })
  }   
})

// 一级 路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/goods', goodsRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
