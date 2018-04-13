const handleDatabaseError = require('../Util/handleDatabaseError');
const formatJoinLeaveMessage = require('../Util/formatJoinLeaveMessage');

module.exports = (bot, r) => {
	bot.on('guildMemberRemove', (guild, member) => {
		r.table('settings').get(guild.id).run((error, settings) => {
			if (error) return handleDatabaseError(error);
			if (settings && settings.leaveMessages.enabled && settings.leaveMessages.channelID && settings.leaveMessages.message && guild.channels.has(settings.leaveMessages.channelID) && guild.channels.get(settings.leaveMessages.channelID).permissionsOf(bot.user.id).has('sendMessages')) {
				guild.channels.get(settings.leaveMessages.channelID).createMessage(formatJoinLeaveMessage(settings.leaveMessages.message, member, guild));
			}
		});
	});
};