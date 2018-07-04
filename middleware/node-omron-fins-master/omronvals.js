var fins = require('./lib/index');


function getOmronValues (cb) {
	var config = {
		ip_address: '0.0.0.0',
		port: 9600,
		}

	var cnt1 = 0;
	var msgID1 = function() {
	    return cnt1 = (cnt1 % 254) + 1;
	};


	var client = fins.FinsClient(config.port,config.ip_address);


	client.on('error',function(error) {
	  console.log("Error: ", error);
	})


	

	

	//setInterval(readOmronPLC, 500);

	
	var addresses = [
	//['D05700', 7],
	//['C2000', 1],
	['C6000', 1]
	]
	var res
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
	})
}

module.exports = getOmronValues
