const SerialPort = require("serialport"),
	  logIt = require('./logIt.js'),
	  functConf = require('../public/configOmron.js'),
	  omronFunctions = require('./omronfunctions.js');

let Readline = SerialPort.parsers.Readline;

const sPort = new SerialPort("/dev/ttyACM0", 
		{
			baudRate: 9600,
		}
	);

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

// let val = 0;
// const colorCnt = function() {
//     return val = (val % 254) + 1;
// };

const rand = (max, min) => Math.floor(Math.random() * (Math.floor(max)-(Math.ceil(min) + 1) + (Math.ceil(min))));

let blink = false;

let controlRandCnt = 0;
let controlRandCntLim = 2;

let multiColorFunctionInc = 0;
let multiColorFunction = len => multiColorFunctionInc == len-1 ? multiColorFunctionInc = 0 : multiColorFunctionInc++;
let outData = '';
let output2 = {};

function translate2serial (output1) {

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
			blink ?	outData = `0, 0, 0\n` : outData = `${rand(255, 0)}, ${rand(255, 0)}, ${rand(255, 0)}\n`;
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


module.exports = translate2serial