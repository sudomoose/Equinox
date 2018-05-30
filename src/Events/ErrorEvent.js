const Logger = require('../Util/Logger');

module.exports = (bot) => {
	bot.on('error', (...errors) => {
		Logger.error('Client emitted errors:', ...errors);
	});
};