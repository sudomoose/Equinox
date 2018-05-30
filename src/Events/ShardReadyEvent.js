const Logger = require('../Util/Logger.js');

module.exports = (bot) => {
	bot.on('shardReady', (id) => {
		Logger.info('Shard ' + id + ' successfully connected.');
	});
};