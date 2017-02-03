var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/contenedorTemplate', function(req, res, next) {
  res.render('contenedor');
});
router.get('/dashboardTemplate', function(req, res, next) {
  res.render('dashboard');
});
router.get('/menu-slideTemplate', function(req, res, next) {
  res.render('menu-slide');
});
router.get('/naviTemplate', function(req, res, next) {
  res.render('contenedor');
});

module.exports = router;
