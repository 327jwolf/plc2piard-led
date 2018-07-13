
exports.logIt = (...arguments) => {
	let dev = true;
	if (dev) {
		if (console) {
			console.log.apply(console, arguments);
		}
	}
}

