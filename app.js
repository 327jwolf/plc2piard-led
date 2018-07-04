const express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	nodepccc = require('nodepccc'),
	getPLCInfo = require('./middleware/getPLCInfo.js'),
	confPLC = require('./middleware/configPLC.js'),
	logIt = require('./middleware/logIt.js'),
	plcOmron = require('./middleware/node-omron-fins-master/omronvals.js'),
	functConf = require('./public/configOmron.js'),
	omronFunctions = require('./middleware/omronfunctions.js'),
	port = process.argv[2] || 3030;

app.use(express.static('public'));
server.listen(port);
console.log("Express server running nodepccc at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");

//**********************************************************************************************************

let plcType = "Omron";//"Omron" "CompactLogix"

//var sendIt = x => console.log(x);

const SerialPort = require("serialport");
let Readline = SerialPort.parsers.Readline;

const sPort = new SerialPort("/dev/ttyACM0", 
		{
			baudRate: 9600,
			//parser: newlineParse
		}, 
		err => err ? console.log('Error: ', err.message): ""
		);

let output1;
let output2 = {};

let red = 1;
let green = 1;
let blue = 1;
let outData = `${red}, ${green}, ${blue}\n`;



//*************************************************

const parser = new Readline();
sPort.pipe(parser);
parser.on('data', function (data) {
  console.log('data received: ' + data);
})

sPort.on('open', function () {
  console.log('Communication is on!');
})

let val = 0;
const colorCnt = function() {
    return val = (val % 254) + 1;
};

const rand = (max, min) => Math.floor(Math.random() * (Math.floor(max)-(Math.ceil(min) + 1) + (Math.ceil(min))));

setInterval( () => {

	for(let i = 0; i < 13; i++){
		if ((output1 & 1 << i) != 0) {
			output2 = functConf[omronFunctions[i]];
		}
	}
	//console.log('output1:************************************* ', output1);
	if (output1 == 0) {
		output2.red = rand(255, 0);
		output2.green = rand(255, 0);
		output2.blue = rand(255, 0);
	}

	outData = `${output2.red}, ${output2.green}, ${output2.blue}\n`;
	console.log('outdata: ', outData);

	sPort.write(outData, (err) => {
			err ? console.log('Error: ', err.message): "";
		})

}, 750)


//*************************************************
if (plcType == "Omron") {
	let res = msg => {
		//console.log(msg);
		output1 = msg;
	}
	setInterval(() => plcOmron(res), 500);
}

//************************************************



if (plcType == "CompactLogix")
 {
	let getMLInfo = (msg) => {
		//console.log('msg =====================> ', msg[0]);
		output1 = msg[0];
	}
	setInterval(() => getPLCInfo('read', configPLC.plcAddr, 0, getMLInfo), 500);
}

//ttyACM0
