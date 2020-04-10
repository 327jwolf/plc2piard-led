#!/usr/bin/env node

const express = require('express'),
	path = require('path'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	config = require('./config/appconfig.js').sysconfig,
	confPLC = require('./config/appconfig.js').configPLC;

const app = express();
const server = require('http').createServer(app);

const nodepccc = require('nodepccc'),
	getPLCInfo = require('./middleware/getPLCInfo.js'),
	logIt = require('./middleware/logIt.js'),
	getOmronInfo = require('./middleware/node-omron-fins-master/getomroninfo.js').getOmronInfo,
	translate2serial = require('./middleware/translate2serial.js'),
	index = require('./routes/index'),
	port = process.argv[2] || 3030;

//app.use(express.static('public'));
server.listen(port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.set('env', 'dev');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

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







console.log("Express server running nodepccc at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");

//************************************************

let plcType = "Omron";//"Omron" "microLogix"
let intervalTime = config.callInterval;

//************************************************
if (config.machineType == "Omron") {
	
	setInterval(() => getOmronInfo(translate2serial), intervalTime);
}

//************************************************

if (config.machineType == "ML") {
	//getPLCInfo('read', confPLC, 0, translate2serial)
	setInterval(() => getPLCInfo('read', confPLC, 0, translate2serial), intervalTime);
	// getPLCInfo('write', confPLC, [0, 22], null)
}

