//configPLC.js
const ips = require('./ips.config')
let neosho = ips.neosho;


configPLC = {
	plcAddr : ['N31:60', 'N7:58', 'B30:21'],
	port : 8315,
	plcHost : neosho

	};

module.exports = configPLC;