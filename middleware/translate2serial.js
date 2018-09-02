const SerialPort = require("serialport"),
      logIt = require('./logIt.js').logIt,
      functConf = require('../public/configOmron.js'),
      omronFunctions = require('./omronfunctions.js'),
      path = require('path');
      
const leddata = require('../models/leddataschema.js');

function fixString2Array (arg) {
    return typeof arg == 'string' ? [arg] : JSON.parse(`[${arg}]`)
}

let newColor = ['0,0,0'];

//setTimeout(function(){
//}, 5000)

function hextorgb (hex) {
    let color = parseInt(hex.slice(1,7), 16)
    let r =  (color & 0xff0000 )>> 16
    let g = (color & 0x00ff00) >> 8
    let b = (color & 0x0000ff)
    return [`${r},${g},${b}`]
}

function getDelayedData (f) {

    return leddata.getDBdata(f, (e, data) => {
        if (e) {
            console.log('GetDBData Error: ', e)
            return
        }
        let fColor = typeof data.color == 'string' 
        ? [hextorgb(data.color)] 
        : data.color.map(x => {
            return hextorgb(x)
        })  
        
        newColor = [fColor, data.plcFunction, data.outputType, data.timing]
        //console.log(newColor, data.color)

    })
}

//getDelayedData("df")

(function getConnectedArduino() {
  SerialPort.list(function(err, ports) {
    var allports = ports.length;
    var count = 0;
    var done = false
    //console.log(ports)
    ports.forEach(function(port) {
      count += 1;
      pm = port['manufacturer'];

      if (typeof pm !== 'undefined' && pm.includes('1a86')) { // || 'arduino'
        arduinoport = port.comName.toString();
        console.log(arduinoport)
        //var serialPort = require('serialport');
        // sPort = new SerialPort(arduinoport, {
        //   buadRate: 9600
        // })
        // sPort.on('open', function() {
        //   console.log('done! arduino is now connected at port: ' + arduinoport)
        // })
        done = true;
      }
      if (count === allports && done === false) {
         console.log('cant find arduino')
      }
    });

  });
})()





let Readline = SerialPort.parsers.Readline;

let nano = "/dev/ttyUSB0"
let uno = "/dev/ttyACM0"
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



// let val = 0;
// const colorCnt = function() {
//     return val = (val % 254) + 1;
// };

const rand = (max, min) => Math.floor(Math.random() * (Math.floor(max)-(Math.ceil(min) + 1) + (Math.ceil(min))));

let blink = false;

let controlRandCnt = 0;
let controlRandCntLim = 4;

let multiColorFunctionInc = 0;
let multiColorFunction = len => multiColorFunctionInc == len-1 ? multiColorFunctionInc = 0 : multiColorFunctionInc++;
let outData = '';
let output2 = {};
let randMax = 25;

function translate2serial (output1) {

    output1 == undefined ? output1 = [0] : output1;

    let computedArrayLen = 1;
    let noData = 0;
    logIt('output1 =',output1);

    let dd;

    for(let i = 0; i < Object.keys(omronFunctions).length; i++){
        if ((output1[0] & 1 << i) != 0) {

            getDelayedData(omronFunctions[i])
            computedArrayLen = newColor[0].length;
            computedArrayLen == 1 ? multiColorFunctionInc = 0 : multiColorFunctionInc;
            outputArray = Array.from(newColor[0]);

            // computedArrayLen = functConf[omronFunctions[i]].length;
            // computedArrayLen == 1 ? multiColorFunctionInc = 0 : multiColorFunctionInc;
            // outputArray = functConf[omronFunctions[i]];


            output2 = outputArray[multiColorFunctionInc];
            logIt(`outputArray = ${JSON.stringify(outputArray)}`);
            logIt(`output2 = ${JSON.stringify(output2)},  ${output2} `);
            multiColorFunction(computedArrayLen);
            break;
        }

    }

    if (computedArrayLen == 1) {
        //controlRandCnt = 0;
        multiColorFunctionInc = 0;
    }

    if(output1[0] == 1){
        blink ? outData = `0, 0, 0\n` : outData = `${output2[0]}, ${output2[1]}, ${output2[2]}\n`;
    }
    else if (output1[0] === 0) {
        newColor[0] = [0,0,0];
        if (controlRandCnt == 0) {
            blink ? outData = `0, 0, 0\n` : outData = `${rand(randMax, 0)}, ${rand(randMax, 0)}, ${rand(randMax, 0)}\n`;
        }
    }
    else{
        outData = `${output2[0]}, ${output2[1]}, ${output2[2]}\n`; 
    }

    if (!sPort.isOpen) {
        sPort.open()
    }


    sPort.write(outData, (err) => err ? console.log('Port Write Error: ', err.message): "");

    

    blink = !blink;

    controlRandCnt++;
    if (controlRandCnt == controlRandCntLim) {
        controlRandCnt = 0;
    }
    logIt('outdata: ', outData);
}


module.exports = translate2serial;