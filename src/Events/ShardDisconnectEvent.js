const Logger = require('../Util/Logger.js');

module.exports = (bot) => {
	bot.on('shardDisconnect', (error, id) => {
		Logger.info('Shard ' + id + ' disconnected: ' + error + '. Reconnecting..');
	});
};