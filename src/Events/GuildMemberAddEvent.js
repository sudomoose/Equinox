const handleDatabaseError = require('../Util/handleDatabaseError');
const formatJoinLeaveMessage = require('../Util/formatJoinLeaveMessage');

module.exports = (bot, r) => {
	bot.on('guildMemberAdd', (guild, member) => {
		r.table('settings').get(guild.id).run((error, settings) => {
			if (error) return handleDatabaseError(error);
			if (settings && settings.joinMessages.enabled && settings.joinMessages.channelID && settings.joinMessages.message && guild.channels.has(settings.joinMessages.channelID) && guild.channels.get(settings.joinMessages.channelID).permissionsOf(bot.user.id).has('sendMessages')) {
				guild.channels.get(settings.joinMessages.channelID).createMessage(formatJoinLeaveMessage(settings.joinMessages.message, member, guild));
			}
		});
	});
};