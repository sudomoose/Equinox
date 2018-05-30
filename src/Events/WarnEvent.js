const Logger = require('../Util/Logger.js');

module.exports = (bot) => {
	bot.on('warn', (...warnings) => {
		Logger.info('Client emitted warnings:', ...warnings);
	});
};