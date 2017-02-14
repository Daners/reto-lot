var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var controlpanel = require('./routes/controlpanel');
var templates = require('./routes/templates');
var mqtt = require('./routes/mqttConection');
var disp = require('./routes/dispositivosRuter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));


app.use(cookieParser());
console.log(__dirname );
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/chartjs', express.static(__dirname + '/node_modules/chart.js/dist'));
app.use('/angular-chartjs', express.static(__dirname + '/node_modules/angular-chart.js/dist'));

app.use('/chartjs', express.static(__dirname + '/node_modules/chart.js/dist'));
app.use('/angular-route', express.static(__dirname + '/node_modules/angular-route'));

app.use('/ng-material', express.static(__dirname + '/node_modules/ng-material-floating-button'));
app.use('/jspath', express.static(__dirname + '/node_modules/jspath/lib'));


app.use('/', controlpanel);
app.use('/templates', templates);
app.use('/mqtt', mqtt);
app.use('/devices', disp);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
