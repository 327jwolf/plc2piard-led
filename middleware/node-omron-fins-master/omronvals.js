const fins = require('./lib/index');
const ips = require('../../middleware/ips.config')


function getOmronValues (cb) {
	const config = {
		ip_address: ips.Galena,
		port: 9600,
		}
	let cnt1 = 0;
	let msgID1 = function() {
	    return cnt1 = (cnt1 % 254) + 1;
	};


	const client = fins.FinsClient(config.port,config.ip_address);


	client.on('error',function(error) {
	  console.log("Error Client: ", error);
	})


	let addresses = [
	//['D05700', 7],
	//['C2000', 1],
	['C6000', 1]
	];

	addresses.map(x => {
		client.read(x[0], x[1], function(err,bytes) {
			msgID1()
			if (bytes) {
				//console.log("Bytes: ", bytes);
			}
			if (err) {
				console.log("Error: ", err);
			}
		})
	})

	client.on('reply',function(msg) {
		//console.log("Reply from: ", msg.remotehost);
		//console.log("Replying to issued command of: ", msg.command);
		//console.log("Response code of: ", msg.code);
		//console.log("C1Data returned: ", msg.values);//(msg.values & 1 << driveforward) === 0 ? 0 : 1
		cb(msg.values)
		client.close;
	})
}

module.exports = getOmronValues
