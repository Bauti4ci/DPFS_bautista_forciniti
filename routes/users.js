var express = require('express');
var router = express.Router();

router.get('/loginform', function (req, res, next) {
  res.render('users/login', { title: 'Inicio de sesión' });
});

router.get('/register', function (req, res, next) {
  res.render('users/register', { title: 'Registro de Usuario' });
});

module.exports = router;
