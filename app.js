require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const db = require('./database/models');
const jwt = require('jsonwebtoken');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products.js');
var apiRouter = require('./routes/api/apiRoutes');

// Se crea la aplicación ANTES de empezar a usarla.
var app = express();

// Configuración del View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Carpetas públicas (Static)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/usersImages', express.static(path.join(__dirname, 'public/usersImages')));
app.use('/productsImages', express.static(path.join(__dirname, 'public/productsImages')));


// Middleware para verificar usuario logueado
app.use(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // --- LÍNEA CORREGIDA ---
      // Se añade el 'include' para traer siempre los roles del usuario
      const user = await db.User.findByPk(decoded.id, {
        include: [{ model: db.Role, as: 'roles' }]
      });

      if (user) {
        delete user.dataValues.password;
        res.locals.userLogged = user;
      }
    } catch (error) {
      // Es una buena práctica limpiar los datos si hay un error
      console.error('Error en middleware de usuario:', error);
      res.locals.userLogged = null;
    }
  }
  next();
});
// Rutas
app.use(cors());
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productsRouter);
app.use('/api', apiRouter);


// Manejo de errores 404
app.use(function (req, res, next) {
  next(createError(404));
});

// Manejador de errores general
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Sincronización de la base de datos
db.sequelize.sync({ force: false })
  .then(() => {
    console.log('Base de datos sincronizada correctamente.');
  })
  .catch(error => {
    console.error('Error al sincronizar la base de datos:', error);
  });

// Exportación del módulo (debe ser la última línea)
module.exports = app;