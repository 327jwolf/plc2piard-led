
exports.logIt = (...arguments) => {
	let dev = false;
	if (dev) {
		if (console) {
			console.log.apply(console, arguments);
		}
	}
}

