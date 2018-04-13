const Logger = require('../Util/Logger.js');

module.exports = (bot) => {
	bot.on('warn', (...args) => {
		Logger.info('Client emitted warnings:', ...args);
	});
};