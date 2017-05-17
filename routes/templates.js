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

router.get('/configTemplate', function(req, res, next) {
  res.render('config');
});
router.get('/chart', function(req, res, next) {
  res.render('chart');
});



// server side route for the partials files
router.get('/:temp', function(req, res){
  console.log(req.params.temp);
    res.render(req.params.temp);
})
module.exports = router;
