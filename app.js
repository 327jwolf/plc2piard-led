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
let prevOutput1;
let output2 = {};
let intervalTime = 500;

// let red = 1;
// let green = 1;
// let blue = 1;
let outData = ''//`${red}, ${green}, ${blue}\n`;

//*************************************************

const parser = new Readline();
sPort.pipe(parser);
parser.on('data', function (data) {
  console.log('data received: ' + data);
})

sPort.on('open', function () {
  console.log('Communication is on!');
})

setInterval( () => { sPort.write(outData, (err) => err ? console.log('Error: ', err.message): "")}, intervalTime)

let val = 0;
const colorCnt = function() {
    return val = (val % 254) + 1;
};

const rand = (max, min) => Math.floor(Math.random() * (Math.floor(max)-(Math.ceil(min) + 1) + (Math.ceil(min))));

let blink = false;

function omronTranslate () {

	for(let i = 0; i < Object.keys(omronFunctions).length; i++){
		if ((output1 & 1 << i) != 0) {
			console.log('current function length', functConf[omronFunctions[i]].length)
			outputArray = functConf[omronFunctions[i]]
			output2 = outputArray[0];
		}
	}

	//console.log('output1:************************************* ', output1);
	if (output1[0] == 0) {
		output2[0] = rand(255, 0);
		output2[1] = rand(255, 0);
		output2[2] = rand(255, 0);
		intervalTime = 750;
	}else{
		intervalTime = 500;
	}

	if(output1[0] == 1){
		blink ?	outData = `0, 0, 0\n` : outData = `${output2[0]}, ${output2[1]}, ${output2[2]}\n`
	}else{
		outData = `${output2[0]}, ${output2[1]}, ${output2[2]}\n`;
	}

	blink = !blink;
	prevOutput1 = output1;
	//console.log('outdata: ', outData);
}

//*************************************************
if (plcType == "Omron") {
	let res = msg => {
		console.log(msg);
		if (JSON.stringify(msg) != JSON.stringify(output1)) {
			output1 = msg;
		}
		omronTranslate()
	}
	setInterval(() => plcOmron(res), intervalTime);
}

//************************************************

if (plcType == "CompactLogix") {
	let getMLInfo = (msg) => {
		if (JSON.stringify(msg) != JSON.stringify(output1)) {
			//console.log('msg =====================> ', msg[0]);
			output1 = msg[0];
		}
	}
	setInterval(() => getPLCInfo('read', configPLC.plcAddr, 0, getMLInfo), 500);
}

//ttyACM0
