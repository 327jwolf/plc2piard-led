const express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	nodepccc = require('nodepccc'),
	getPLCInfo = require('./middleware/getPLCInfo.js'),
	//confPLC = require('./middleware/configPLC.js'),
	logIt = require('./middleware/logIt.js'),
	getOmronInfo = require('./middleware/node-omron-fins-master/getomroninfo.js'),
	translate2serial = require('./middleware/translate2serial.js')
	port = process.argv[2] || 3030;

app.use(express.static('public'));
server.listen(port);
console.log("Express server running nodepccc at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");

//**********************************************************************************************************

let plcType = "Omron";//"Omron" "microLogix"
let intervalTime = 750;

//*************************************************
if (plcType == "Omron") {
	
	setInterval(() => getOmronInfo(translate2serial), intervalTime);
}

//************************************************

if (plcType == "microLogix") {
	
	setInterval(() => getPLCInfo('read', configPLC.plcAddr, 0, translate2serial), intervalTime);
}

