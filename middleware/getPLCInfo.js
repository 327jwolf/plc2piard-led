const nodepccc = require('nodepccc');
const logIt = require('../middleware/logIt.js');
const  config = require('../config/appconfig.js').sysconfig;
const confPLC = require('../config/appconfig.js').configPLC;

function decimalToHexString(number){
    if (number < 0){
    	number = 0xFFFFFFFF + number + 1;
    }
    return "0x" + number.toString(16).toUpperCase();
}

const conn = new nodepccc

const createConnection = () => {
	conn.initiateConnection({port: confPLC.port, host: confPLC.plcHost}, connected);	
}

createConnection();

function connected(err) {
	if (typeof(err) !== "undefined") {
		console.log("........", err);
		conn.dropConnection();
		// process.exit();
		return
	}
	conn.addItems(confPLC.plcAddr);
}

function getPLCInfo(ftype, addr, wVal, cb){
	let doneReading = false,
		doneWriting = false,
		data1,
		sessId;
	this.ftype = ftype;
	this.addr = addr.plcAddr;
	this.wVal = wVal;
	this.cb = cb;
	// console.log("ConnectionState == ", conn.isoConnectionState);
	if (ftype == 'read' && conn.isoConnectionState === 4) {conn.readAllItems(valuesReady);};
	if (ftype == 'write' && conn.isoConnectionState === 4) {conn.writeItems(confPLC.plcAddr, wVal, valuesWritten);};


	if(conn.isoConnectionState === 1){
		conn.removeItems(confPLC.plcAddr);
		conn.dropConnection();
	}
	if(conn.isoConnectionState === 0){
		setTimeout(()=>{
				createConnection();
		}, 100)
	}
	
	/////////////////////////////////////////////////////////////////////////

	function valuesReady(err, values) {
		if (err) { 
			console.log("SOMETHING WENT WRONG READING VALUES!!!!"); 
			
			
		}

		let data = [];
		for (let i = 0; i < confPLC.plcAddr.length; i++) {
			data.push(conn.findItem(confPLC.plcAddr[i]).value);
		}
		
		doneReading = true;
		if (doneReading) {
			sessId = decimalToHexString(conn.sessionHandle);
			// conn.removeItems(confPLC.plcAddr);
			// conn.dropConnection();
			return cb(data, sessId);
		}
	}

	/////////////////////////////////////////////////////////////////////////

	function valuesWritten(err) {
		if (err) { console.log("SOMETHING WENT WRONG WRITING VALUES!!!!"); };
		doneWriting = true;
		// conn.removeItems(confPLC.plcAddr);
		// conn.dropConnection();
	}

}


module.exports = getPLCInfo;