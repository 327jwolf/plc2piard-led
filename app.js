#!/usr/bin/env node

import express, { static } from 'express';
import { join } from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'body-parser';
import { sysconfig as config } from './config/appconfig.js';
import { configPLC as confPLC } from './config/appconfig.js';

const app = express();
const server = require('http').createServer(app);

// import nodepccc from 'nodepccc';
import getPLCInfo from './middleware/getPLCInfo.js';
// import logIt from './middleware/logIt.js';
import { getOmronInfo } from './middleware/node-omron-fins-master/getomroninfo.js';
import translate2serial from './middleware/translate2serial.js';
import index from './routes/index';
const port = process.argv[2] || 3030;

//app.use(express.static('public'));
server.listen(port);

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'pug');

app.set('env', 'dev');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(static(join(__dirname, 'public')));

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
	
	setInterval(() => getOmronInfo(translate2serial), config.callInterval);
}

//************************************************

if (config.machineType == "ML") {

	setInterval(() => getPLCInfo('read', confPLC, 0, translate2serial), config.callInterval);

}

