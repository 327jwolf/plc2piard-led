//configPLC.js

let neosho = '209.33.37.237';
let pocatello = '67.41.36.83';
let local192 = '192.168.1.74';
let Tullahoma_1433 = '199.59.172.49';

configPLC = {
	plcAddr : ['N7:96', 'N7:58', 'B30:21'],
	port : 8315,
	plcHost : neosho

	};

module.exports = configPLC;