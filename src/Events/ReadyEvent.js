const Lavalink = require('eris-lavalink');
const humanizeDuration = require('humanize-duration');
const Logger = require('../Util/Logger.js');
const Reminder = require('../Structure/Reminder');
const handleCalls = require('../Util/handleCalls');
const handleGiveaways = require('../Util/handleGiveaways');
const updateGuildCount = require('../Util/updateGuildCount');
const handleDatabaseError = require('../Util/handleDatabaseError');
const config = require('../config.json');

module.exports = (bot, r, metrics) => {
	bot.on('ready', () => {
		Logger.info('Successfully logged in as ' + bot.user.username + '.');

		metrics.increment('ready');
		
		/* bot.voiceConnections = new Lavalink.PlayerManager(bot, config.lavalink.nodes, {
			userId: bot.user.id,
			numShards: bot.shards.size
		}); */

		r.table('reminders').run((error, reminders) => {
			if (error) return handleDatabaseError(error);
			for (let i = 0; i < reminders.length; i++) {
				bot.reminders.set(reminders[i].id, new Reminder(bot, r, reminders[i]));
			}
		});

		handleCalls(bot, r);
		handleGiveaways(bot, r);
		updateGuildCount(bot);

		r.table('intervals').get('restart').run((error, restart) => {
			if (error) return handleDatabaseError(error);
			if (!restart) return;
			r.table('intervals').get('restart').delete().run((error) => {
				if (error) return handleDatabaseError(error);
				if (!(restart.channelID in bot.channelGuildMap)) return;
				const channel = bot.guilds.get(bot.channelGuildMap[restart.channelID]).channels.get(restart.channelID);
				channel.createMessage(':white_check_mark:   **»**   Successfully restarted in `' + humanizeDuration(Date.now() - restart.timestamp) + '`.');
			});
		});
	});
};