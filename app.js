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
let intervalTime = 750;

const SerialPort = require("serialport");
let Readline = SerialPort.parsers.Readline;

const sPort = new SerialPort("/dev/ttyACM0", 
		{
			baudRate: 9600,
			//parser: newlineParse
		}, 
		err => err ? console.log('Error: ', err.message): ""
		);

//*************************************************

const parser = new Readline();
sPort.pipe(parser);
parser.on('data', function (data) {
  console.log('data received: ' + data);
})

sPort.on('open', function () {
  console.log('Communication is on!');
})

//setInterval( () => { sPort.write(writeOutputData, (err) => err ? console.log('Error: ', err.message): "")}, intervalTime)

let val = 0;
const colorCnt = function() {
    return val = (val % 254) + 1;
};

const rand = (max, min) => Math.floor(Math.random() * (Math.floor(max)-(Math.ceil(min) + 1) + (Math.ceil(min))));
let output2 = {};
let blink = false;

let controlRandCnt = 0;
let controlRandCntLim = 3;

let multiColorFunctionInc = 0;
let multiColorFunction = len => multiColorFunctionInc == len -1 ? multiColorFunctionInc = 0 : multiColorFunctionInc++

function omronTranslate (output1) {
	let outData = '';

	for(let i = 0; i < Object.keys(omronFunctions).length; i++){
		if ((output1 & 1 << i) != 0) {
			logIt('current function length', functConf[omronFunctions[i]].length)
			if (functConf[omronFunctions[i]].length == 1) {
				multiColorFunctionInc = 0;
			}
			outputArray = functConf[omronFunctions[i]]
			output2 = outputArray[multiColorFunctionInc];
			if (functConf[omronFunctions[i]].length > 1) {
				 multiColorFunction(functConf[omronFunctions[i]].length);
			}
		}
	}

	//console.log('output1:************************************* ', output1);
	if (output1[0] == 0 && controlRandCnt == 0) {
		output2[0] = rand(255, 0);
		output2[1] = rand(255, 0);
		output2[2] = rand(255, 0);
		intervalTime = 750;
	}else{
		intervalTime = 750;
	}

	if(output1[0] == 1){
		blink ?	outData = `0, 0, 0\n` : outData = `${output2[0]}, ${output2[1]}, ${output2[2]}\n`
	}else{
		outData = `${output2[0]}, ${output2[1]}, ${output2[2]}\n`;
	}
	sPort.write(outData, (err) => err ? console.log('Error: ', err.message): "")
	blink = !blink;

	controlRandCnt++;
	if (controlRandCnt == controlRandCntLim) {
		controlRandCnt = 0;
	}
	logIt('outdata: ', outData);
}

//*************************************************
if (plcType == "Omron") {
	
	setInterval(() => plcOmron(omronTranslate), intervalTime);
}

//************************************************

if (plcType == "CompactLogix") {
	
	setInterval(() => getPLCInfo('read', configPLC.plcAddr, 0, omronTranslate), intervalTime);
}

