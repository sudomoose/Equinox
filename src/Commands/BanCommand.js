const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');
const resolveMember = require('../Util/resolveMember');
const formatBanLogMessage = require('../Util/formatBanLogMessage');

class Ban extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'ban',
			aliases: [],
			description: 'Bans a user from the server.',
			category: 'Moderation',
			usage: 'ban <user> [<reason...>]',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		if (!msg.channel.guild) return msg.channel.createMessage(':no_entry_sign:   **»**   This command cannot be used in a direct message.');
		if (!msg.member.permission.has('banMembers')) return msg.channel.createMessage(':no_entry_sign:   **»**   You need the `Ban Members` permission in order to use this command.');
		if (!msg.channel.guild.members.get(this.bot.user.id).permission.has('banMembers')) return msg.channel.createMessage(':no_entry_sign:   **»**   I need the `Ban Members` permission in order to complete this command.');
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a user to ban.');
		this.r.table('modlog').filter({ guildID: msg.channel.guild.id }).count().run((error, cases) => {
			if (error) return handleDatabaseError(error, msg);
			resolveMember(this.bot, args[0], msg.channel.guild, true).then((member) => {
				this.bot.pardonModLog.set(member.id, true);
				member.ban(null, args.length > 1 ? args.slice(1).join(' ') : null).then(() => {
					this.r.table('settings').get(msg.channel.guild.id).run((error, settings) => {
						if (error) return handleDatabaseError(error, msg);
						if (settings && settings.banLog.enabled && settings.banLog.channelID && msg.channel.guild.channels.has(settings.banLog.channelID) && msg.channel.guild.channels.get(settings.banLog.channelID).permissionsOf(this.bot.user.id).has('sendMessages')) {
							msg.channel.guild.channels.get(settings.banLog.channelID).createMessage(formatBanLogMessage(this.bot, msg.channel.guild, member, args.length > 1 ? args.slice(1).join(' ') : null, cases + 1, msg.author)).then((message) => {
								this.r.table('modlog').insert({
									type: 1,
									guildID: msg.channel.guild.id,
									caseID: cases + 1,
									user: member.user.toJSON(),
									reason: args.length > 1 ? args.slice(1).join(' ') : null,
									messageID: message.id,
									moderator: msg.author.toJSON()
								}).run((error) => {
									if (error) return handleDatabaseError(error, msg);
									msg.channel.createMessage(':hammer:   **»**   Successfully banned ' + member.username + '#' + member.discriminator + ' (' + member.id + ').');
								});
							});
						} else {
							msg.channel.createMessage(':hammer:   **»**   Successfully banned ' + member.username + '#' + member.discriminator + ' (' + member.id + ').');
						}
					});
				}).catch(() => {
					msg.channel.createMessage(':exclamation:   **»**   Failed to ban ' + member.username + '#' + member.discriminator + '. Please note that I cannot ban members that have a higher role than mine.');
				});
			}).catch(() => {
				msg.channel.createMessage(':exclamation:   **»**   Unable to find any users by that query.');
			});
		});
	}
}

module.exports = Ban;