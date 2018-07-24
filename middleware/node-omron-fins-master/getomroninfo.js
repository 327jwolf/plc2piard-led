const fins = require('./lib/index'),
	  ips = require('../../middleware/ips.config'),
	  logIt = require('../logIt.js').logIt,
	  logToFile = require('../logToFile.js').logToFile;

let cnt1 = 0;
let msgID1 = function() {
	    return cnt1 = (cnt1 % 254) + 1;
	};
function getTimestamp() {
	var dt = new Date();
	var localDate = dt.toString();
	return localDate;
}

function getOmronInfo (cb) {
	const config = {
		ip_address: ips.Galena,
		port: 9600
		}

	const client = fins.FinsClient(config.port,config.ip_address, {
		timeout: 2000
	});


	client.on('error',function(error) {
	  console.log(`Error Client: ${getTimestamp()} - ${error}`);
	  logToFile(`Error Client: ${getTimestamp()} - ${error}`);
	  cb([0]);
	  client.close();
	})

	client.on('timeout',function(error) {
	  //console.log(`Timeout Client: ${getTimestamp()} - ${error}`);
	  //logToFile(`Timeout Client: ${getTimestamp()} - ${error}`);
	  cb([0]);
	  client.close();
	})


	let addresses = [
	//['D05700', 7],
	//['C2000', 1],
	['C6000', 2]
	];

	addresses.map(x => {
		client.read(x[0], x[1], function(err,bytes) {
			logIt(`*********ReadID: ${msgID1()}***********`);
			if (bytes) {
				logIt("Bytes: ", bytes);
			}
			if (err) {
				console.log("ReadError: ", err);
				logToFile("ReadError: ", err);
				cb([0]);
	  			client.close();
			}
		})
	})

	client.on('reply',function(msg) {
		logIt(getTimestamp());
		logIt("Reply from: ", msg.remotehost);
		logIt("Replying to issued command of: ", msg.command);
		logIt("Response code of: ", msg.response);
		logIt("C1Data returned: ", msg.values);
		logIt("SID: ", msg.sid, '\n');
		cb(msg.values);
		client.close();
	})
}

module.exports = getOmronInfo;
