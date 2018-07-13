const fs = require('fs');
const util = require('util');


function padZero(x) {
	return x < 10 ? '0' + x : x;
}

function getDate() {
	var d = new Date();
	var yyyymmddDate = `${d.getFullYear()}-${padZero(d.getMonth()+1)}-${padZero(d.getDate())}`;
	return yyyymmddDate;
}

exports.logToFile = function(d) {
  	fs.appendFile('./logs/debug ' + getDate() + '.log', d + "\n", (err) => {
	  if (err) throw err;
	  console.log('The "data to append" was appended to file!');
	});
};