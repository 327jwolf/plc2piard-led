
function logIt(){
	let dev = true;
	if (dev) {
		if (console) {
			console.log.apply(console, arguments);
		}
	}
}

module.exports = logIt;