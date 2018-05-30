const Logger = require('../Util/Logger.js');

module.exports = (bot) => {
	bot.on('disconnect', (error) => {
		Logger.info('Client disconnected: ' + error + '. Reconnecting...');
	});
};