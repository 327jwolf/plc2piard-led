
function logIt(){
	let dev = false;
	if (dev) {
		if (console) {
			console.log.apply(console, arguments);
		}
	}
}

module.exports = logIt;