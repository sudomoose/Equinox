const handleDatabaseError = require('../Util/handleDatabaseError');
const formatJoinLeaveMessage = require('../Util/formatJoinLeaveMessage');
const formatBanLogMessage = require('../Util/formatBanLogMessage');
const formatKickLogMessage = require('../Util/formatKickLogMessage');

module.exports = (bot, r) => {
	bot.on('guildMemberRemove', (guild, member) => {
		r.table('settings').get(guild.id).run((error, settings) => {
			if (error) return handleDatabaseError(error);
			if (settings && settings.leaveMessages.enabled && settings.leaveMessages.channelID && settings.leaveMessages.message && guild.channels.has(settings.leaveMessages.channelID) && guild.channels.get(settings.leaveMessages.channelID).permissionsOf(bot.user.id).has('sendMessages')) {
				guild.channels.get(settings.leaveMessages.channelID).createMessage(formatJoinLeaveMessage(settings.leaveMessages.message, member, guild));
			}
			if (bot.pardonModLog.has(member.id)) return bot.pardonModLog.delete(member.id);
			if (settings && settings.banLog.enabled && settings.banLog.channelID && guild.channels.has(settings.banLog.channelID) && guild.channels.get(settings.banLog.channelID).permissionsOf(bot.user.id).has('sendMessages')) {
				guild.getAuditLogs(1, null, 22).then((logs) => {
					const filtered = logs.entries.filter((entry) => entry.targetID === member.id);
					if (filtered.length > 0) {
						r.table('modlog').filter({ guildID: guild.id }).count().run((error, cases) => {
							if (error) return handleDatabaseError(error);
							guild.channels.get(settings.banLog.channelID).createMessage(formatBanLogMessage(bot, guild, member, filtered[0].reason, cases + 1, filtered[0].user)).then((message) => {
								r.table('modlog').insert({
									type: 2,
									guildID: guild.id,
									caseID: cases + 1,
									user: member.user.toJSON(),
									reason: filtered[0].reason,
									messageID: message.id,
									moderator: filtered[0].user.toJSON()
								}).run((error) => {
									if (error) return handleDatabaseError(error);
								});
							});
						});
					}
				});
			}
			if (settings && settings.kickLog.enabled && settings.kickLog.channelID && guild.channels.has(settings.kickLog.channelID) && guild.channels.get(settings.kickLog.channelID).permissionsOf(bot.user.id).has('sendMessages')) {
				guild.getAuditLogs(1, null, 20).then((logs) => {
					const filtered = logs.entries.filter((entry) => entry.targetID === member.id);
					if (filtered.length > 0) {
						r.table('modlog').filter({ guildID: guild.id }).count().run((error, cases) => {
							if (error) return handleDatabaseError(error);
							guild.channels.get(settings.banLog.channelID).createMessage(formatKickLogMessage(bot, guild, member, filtered[0].reason, cases + 1, filtered[0].user)).then((message) => {
								r.table('modlog').insert({
									type: 2,
									guildID: guild.id,
									caseID: cases + 1,
									user: member.user.toJSON(),
									reason: filtered[0].reason,
									messageID: message.id,
									moderator: filtered[0].user.toJSON()
								}).run((error) => {
									if (error) return handleDatabaseError(error);
								});
							});
						});
					}
				});
			}
		});
	});
};