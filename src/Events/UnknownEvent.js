const Logger = require('../Util/Logger.js');

module.exports = (bot) => {
	bot.on('unknown', (payload, shard) => {
		Logger.info('Shard  ' + shard + ' received an unknown payload:', payload);
	});
};