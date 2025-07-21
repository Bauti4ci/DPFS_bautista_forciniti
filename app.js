var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session'); // Se usa 'var' para mantener consistencia

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products.js');
const { log } = require('console');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'powerup_secret_string',
  resave: false,
  saveUninitialized: false,
}));

app.use(function (req, res, next) {
  console.log(req.cookies.userLogged);
  if (req.session.userLogged !== undefined) {
    res.locals.userLogged = req.session.userLogged
  }
  return next()
})

// Rutas
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productsRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;