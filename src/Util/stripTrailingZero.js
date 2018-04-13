module.exports = (temperature) => {
	if (temperature % 1 === 0) return Math.trunc(temperature);
	return temperature.toFixed(1);
};