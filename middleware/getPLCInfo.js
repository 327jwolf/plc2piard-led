const nodepccc = require('nodepccc'),
	logIt = require('../middleware/logIt.js');

function decimalToHexString(number){
    if (number < 0){
    	number = 0xFFFFFFFF + number + 1;
    }
    return "0x" + number.toString(16).toUpperCase();
}

function getPLCInfo(ftype, addr, wVal, cb){
	let plcHost = addr.plcHost,
		plcPort = addr.port,
		conn = new nodepccc,
		doneReading = false,
		doneWriting = false,
		data1,
		sessId;
	this.ftype = ftype;
	this.addr = addr.plcAddr;
	this.wVal = wVal;
	this.cb = cb;
	// console.log("....args......", [ftype, addr.plcAddr, wVal, cb])

	/////////////////////////////////////////////////////////////////////////

	conn.initiateConnection({port: plcPort, host: plcHost}, connected);

	/////////////////////////////////////////////////////////////////////////

	function connected(err) {
		if (typeof(err) !== "undefined") {
			console.log("........", err);
			process.exit();
		}
		//conn.addItems(['B3:0', 'B3:1']);//This Works
		conn.addItems(addr.plcAddr); 
		// conn.readAllItems(valuesReady);
		if (ftype == 'read') {conn.readAllItems(valuesReady);};
		if (ftype == 'write') {conn.writeItems(addr.plcAddr, wVal, valuesWritten);};

	}

	/////////////////////////////////////////////////////////////////////////

	function valuesReady(err, values) {
		if (err) { console.log("SOMETHING WENT WRONG READING VALUES!!!!"); }

		let data = [];
		for (let i = 0; i < addr.plcAddr.length; i++) {
			data.push(conn.findItem(addr.plcAddr[i]).value);
		}
		
		doneReading = true;
		if (doneReading) {
			sessId = decimalToHexString(conn.sessionHandle);
			//console.log('--------------------' + sessId);
			//logIt("Read data: %s --sessionHandle: %s--- Date: %s", data, sessId, Date());
			conn.removeItems(addr.plcAddr);
			conn.dropConnection();
			return cb(data, sessId);
		}
	}

	/////////////////////////////////////////////////////////////////////////

	function valuesWritten(err) {
		if (err) { console.log("SOMETHING WENT WRONG WRITING VALUES!!!!"); }
		//logIt("Done writing.-- %s --. Date: %s.................", wVal, Date());
		doneWriting = true;
		conn.removeItems(addr.plcAddr);
		conn.dropConnection();
	}

		
}


module.exports = getPLCInfo;