const SerialPort = require("serialport"),
    logIt = require('./logIt.js').logIt,
    leddata = require('../models/leddataschema.js'),
    path = require('path');
const config = require('../config/appconfig.js').sysconfig;
// const Gpio = require('pigpio').Gpio;
// const led_R = new Gpio(17, {mode: Gpio.OUTPUT});
// const led_G = new Gpio(22, {mode: Gpio.OUTPUT});
// const led_B = new Gpio(24, {mode: Gpio.OUTPUT});

// const plcFunctions = require('../config/appconfig.js').plcFunc;

function fixString2Array (arg) {
    return typeof arg == 'string' ? [arg] : JSON.parse(`[${arg}]`)
}

// THIS FUNCTION ONLY LISTS AND FINDS THE ARDUINO USB PORT NOT NEEDED ONCE YOU KNOW THE USB PORT PATH
// YOU WILL NEED TO GIVE THE USP PORT PERMISSION TO BE ACCESSED USING BASH
// sudo chmod a+rw /dev/ttyUSB0 will only temporary permissions.
// use sudo adduser YourUserName GroupToJoin 

// (function getConnectedArduino() {
//     SerialPort.list().then( ports =>  {
//         var allports = ports.length;
//         var count = 0;
//         var done = false
//         //console.log(ports)
//         ports.forEach(function(port) {
//             count += 1;
//             pm = port['manufacturer'];
    
//             if (typeof pm !== 'undefined' && pm.includes('1a86')) { // || 'arduino'
//                 arduinoport = port.path.toString();
//                 nano = port.path;
//                 console.log("arduino port info....", arduinoport)

//                 done = true;
//             }
//             if (count === allports && done === false) {
//             console.log('cant find arduino')
//             }
//         })
      
//         },
//         err => console.log("tested port list error: ", err));
//   })()

let Readline = SerialPort.parsers.Readline;

const nano = config.serialPort;

const sPort = new SerialPort(nano, // "/dev/ttyACM0" /dev/ttyUSB0
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
const rand = (max, min) => Math.floor(Math.random() * (Math.floor(max)-(Math.ceil(min) + 1) + (Math.ceil(min))));

let blink = false;

let controlRandCnt = 0;
let controlRandCntLim = 4;

let colorInc = 0;

let multiColorFunctionInc = 0;
let multiColorFunction = len => multiColorFunctionInc == len-1 ? multiColorFunctionInc = 0 : multiColorFunctionInc++;
let outData = '';
let output2 = {};
let randMax = config.randMax;
let randMin = config.randMin;
let newColor = ['0,0,0'];

function hextorgb (hex) {
    let color = parseInt(hex.slice(1,7), 16)
    let r =  (color & 0xff0000 )>> 16
    let g = (color & 0x00ff00) >> 8
    let b = (color & 0x0000ff)
    return [`${r},${g},${b}`]
}

let plcFuncObj = {}
let getPLCFuncObj = () => {
    leddata.getItAll()
    .then(d => d.map(y => {
        plcFuncObj[y._id] = {plcFunction: y.plcFunction, 
                color: y.color, 
                outputType: y.outputType,
                timing: y.timing
            }
        })
    )
    // .then(() => plcFuncObj)
    .catch(e => console.log(e))
}

function translate2serial (output1) {
    getPLCFuncObj()
    output1 == undefined ? output1 = [0] : output1;
    let computedArrayLen = 1;
    // let noData = 0;
    logIt('output1 =',output1);
    
    if (plcFuncObj['1'] && output1[0] != 0) {
        let outStr = (Math.log(output1[0]<<1)/Math.log(2)).toString(10)
        let fColor = typeof plcFuncObj[outStr].color == 'string' 
        ? [hextorgb(plcFuncObj[outStr].color)] 
        : plcFuncObj[outStr].color.map(x => {
            return hextorgb(x)
        })
        logIt(fColor)   
        newColor = [fColor, plcFuncObj[outStr].plcFunction, plcFuncObj[outStr].outputType, plcFuncObj[outStr].timing]
        computedArrayLen = newColor[0].length;
        computedArrayLen == 1 ? multiColorFunctionInc = 0 : multiColorFunctionInc;
        outputArray = Array.from(newColor[0]);

        output2 = outputArray[multiColorFunctionInc];
        logIt(`outputArray = ${JSON.stringify(outputArray)}`);
        logIt(`output2 = ${JSON.stringify(output2)},  ${output2} `);
        multiColorFunction(computedArrayLen);
        
    }

    if (computedArrayLen == 1) {
        //controlRandCnt = 0;
        multiColorFunctionInc = 0;
    }
    
    if(newColor[2] == '1' && output1[0] != 0){
        blink ? outData = `0, 0, 0\n` : outData = `${output2[0]}\n`;
    }
    else if (output1[0] === 0) {
        newColor[2] = 0;
        newColor[0] = [0,0,0];
        if (controlRandCnt == 0) {
            blink ? outData = `0, 0, 0\n` : outData = `${ (colorInc & 1) === 1 ? 255 : rand(randMax, 0)},${ (colorInc & 2) === 2  ? 255 : rand(randMax, 0)},${ (colorInc & 4) === 4 ? 255 : rand(randMax, 0)}\n`;
            colorInc++
            if(colorInc === 7) {colorInc = 0};
        }
    }
    else{
        outData = `${output2[0]}\n`; 
    }

    if (!sPort.isOpen) {
        sPort.open()
    }


    sPort.write(outData, (err) => err ? console.log('Port Write Error: ', err.message): "#####");

    blink = !blink;

    controlRandCnt++;
    if (controlRandCnt == controlRandCntLim) {
        controlRandCnt = 0;
    }
    logIt('outdata: ', outData);
}


module.exports = translate2serial;
