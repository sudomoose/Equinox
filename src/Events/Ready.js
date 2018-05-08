const Lavalink = require('eris-lavalink');
const humanizeDuration = require('humanize-duration');
const Logger = require('../Util/Logger.js');
const handleReminders = require('../Util/handleReminders');
const updateGuildCount = require('../Util/updateGuildCount');
const handleDatabaseError = require('../Util/handleDatabaseError');
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

		r.table('intervals').get('restart').run((error, restart) => {
			if (error) return handleDatabaseError(error);
			if (!restart || !(restart.channelID in bot.channelGuildMap)) return;
			const channel = bot.guilds.get(bot.channelGuildMap[restart.channelID]).channels.get(restart.channelID);
			channel.createMessage(':white_check_mark:   **»**   Successfully restarted in `' + humanizeDuration(Date.now() - restart.timestamp) + '`.');
		});
	});
};