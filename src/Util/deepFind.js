/* https://stackoverflow.com/questions/8817394/javascript-get-deep-value-from-object-by-passing-path-to-it-as-string */

module.exports = (object, path) => {
	const paths = path.split('.');
	let current = object;

	for (let i = 0; i < paths.length; i++) {
		if (current[paths[i]] === undefined) {
			return undefined;
		} else {
			current = current[paths[i]];
		}
	}

	return current;
};