var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/api/login');
var registerRouter = require('./routes/api/register');
var tradeRouter = require('./routes/api/trade');
var checkRouter = require('./routes/api/check');
var checkMiddle = require('./routes/middleware/auth');
var getBook = require('./routes/api/getBook');
var User= require('./routes/api/user')
var Match= require('./routes/api/match')


var app = express();

const config = require('./config');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('jwt-secret', config.secret)

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth/login', usersRouter);
app.use('/auth/register', registerRouter);
app.use('/trade', tradeRouter);
app.use('/user', User);
app.use('/getBook', getBook);
app.use('/match', Match);

app.use('/auth/check',checkMiddle)
app.use('/auth/check',checkRouter)

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
