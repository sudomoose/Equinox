const Lavalink = require('eris-lavalink');
const Logger = require('../Util/Logger.js');
const handleReminders = require('../Util/handleReminders');
const updateGuildCount = require('../Util/updateGuildCount');
const config = require('../config.json');

module.exports = (bot, r) => {
	bot.on('ready', () => {
		Logger.info('Successfully logged in as ' + bot.user.username + '.');
		
		bot.voiceConnections = new Lavalink.PlayerManager(bot, config.lavalink.nodes, {
			userId: bot.user.id,
			numShards: bot.shards.size
		});

		handleReminders(bot, r);
		updateGuildCount(bot);
	});
};