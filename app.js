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

let plcType = "Omron";//"Omron" "microLogix"
let intervalTime = 750;

const SerialPort = require("serialport");
let Readline = SerialPort.parsers.Readline;

const sPort = new SerialPort("/dev/ttyACM0", 
		{
			baudRate: 9600,
			//parser: newlineParse
		}
		// , 
		// err => err ? console.log('Error: ', err.message): ""
		);

//*************************************************

const parser = new Readline();
sPort.pipe(parser);
parser.on('data', function (data) {
  logIt('data received: ', data);
  logIt('*********************************');
  logIt('');
})

sPort.on('open', function () {
  console.log('Communication is on!');
})

sPort.on('error', function (err) {
  console.log('Serial Port Error', err);
})

//setInterval( () => { sPort.write(writeOutputData, (err) => err ? console.log('Error: ', err.message): "")}, intervalTime)

let val = 0;
const colorCnt = function() {
    return val = (val % 254) + 1;
};

const rand = (max, min) => Math.floor(Math.random() * (Math.floor(max)-(Math.ceil(min) + 1) + (Math.ceil(min))));

let blink = false;

let controlRandCnt = 0;
let controlRandCntLim = 2;

let multiColorFunctionInc = 0;
let multiColorFunction = len => multiColorFunctionInc == len-1 ? multiColorFunctionInc = 0 : multiColorFunctionInc++;
let outData = '';
let output2 = {};

function omronTranslate (output1) {

	output1 == undefined ? output1 = [0] : output1;

	if (!sPort.isOpen) {
		sPort.open()
	}

	let computedArrayLen = 1;
	let noData = 0;
	logIt('output1 =',output1)
	for(let i = 0; i < Object.keys(omronFunctions).length; i++){
		if ((output1[0] & 1 << i) != 0) {
			computedArrayLen = functConf[omronFunctions[i]].length;
			computedArrayLen == 1 ? multiColorFunctionInc = 0 : multiColorFunctionInc;
			outputArray = functConf[omronFunctions[i]]
			
			output2 = outputArray[multiColorFunctionInc];
			logIt(`outputArray = ${JSON.stringify(outputArray)}`);
			logIt(`output2 = ${JSON.stringify(output2)}`);
			multiColorFunction(computedArrayLen);
			break;
		}

	}

	if (computedArrayLen == 1) {
		//controlRandCnt = 0;
		multiColorFunctionInc = 0;
	}

	if(output1[0] == 1){
		blink ?	outData = `0, 0, 0\n` : outData = `${output2[0]}, ${output2[1]}, ${output2[2]}\n`
	}
	else if (output1[0] === 0) {
		if (controlRandCnt == 0) {
			outData = `${rand(255, 0)}, ${rand(255, 0)}, ${rand(255, 0)}\n`;
		}
	}
	else{
		outData = `${output2[0]}, ${output2[1]}, ${output2[2]}\n`; 
	}

	sPort.write(outData, (err) => err ? console.log('Port Write Error: ', err.message): "")
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

if (plcType == "microLogix") {
	
	setInterval(() => getPLCInfo('read', configPLC.plcAddr, 0, omronTranslate), intervalTime);
}

