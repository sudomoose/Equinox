const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');
const formatBanLogMessage = require('../Util/formatBanLogMessage');
const formatKickLogMessage = require('../Util/formatKickLogMessage');

class Daily extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'reason',
			aliases: [],
			description: 'Edits the reason of a ban in the ban log.',
			category: 'Moderation',
			usage: 'reason <case ID> <reason...>',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		if (!msg.channel.guild) return msg.channel.createMessage(':no_entry_sign:   **»**   This command cannot be used in a direct message.');
		this.r.table('developers').get(msg.author.id).run((error, developer) => {
			if (error) return handleDatabaseError(error, msg);
			if (!msg.member.permission.has('manageGuild') && !developer) return msg.channel.createMessage(':no_entry_sign:   **»**   You need the `Manage Server` permission in order to use this command.');
			if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a case ID.');
			if (isNaN(args[0])) return msg.channel.createMessage(':exclamation:   **»**   The case ID must be a valid number.');
			if (Number(args[0]) < 1) return msg.channel.createMessage(':exclamation:   **»**   The case ID must be greater than or equal to 1.');
			if (args.length < 2) return msg.channel.createMessage(':question:   **»**   You must provide a reason.');
			this.r.table('modlog').filter({ guildID: msg.channel.guild.id, caseID: Number(args[0]) }).run((error, cases) => {
				if (error) return handleDatabaseError(error, msg);
				if (cases.length < 1) return msg.channel.createMessage(':exclamation:   **»**   Unable to find any cases by that ID.');
				const data = { reason: args.slice(1).join(' ') };
				if (!cases[0].moderator) data.moderator = msg.author.toJSON();
				this.r.table('modlog').filter({ guildID: msg.channel.guild.id, caseID: Number(args[0]) }).update(data).run((error) => {
					if (error) return handleDatabaseError(error, msg);
					this.r.table('settings').get(msg.channel.guild.id).run((error, settings) => {
						if (error) return handleDatabaseError(error, msg);
						if (!settings || (cases[0].type === 1 && (!settings.banLog.enabled || !settings.banLog.channelID)) || (cases[0].type === 2 && (!settings.kickLog.enabled || !settings.kickLog.channelID))) return msg.channel.createMessage(':exclamation:   **»**   Unable to edit the reason message in the ' + (cases[0].type === 1 ? 'ban' : 'kick') + ' log channel because ' + (cases[0].type === 1 ? 'ban' : 'kick') + ' logging isn\'t setup.');
						if (cases[0].type === 1) {
							if (!msg.channel.guild.channels.has(settings.banLog.channelID)) return msg.channel.createMessage(':exclamation:   **»**   Unable to find the configured ban log channel in this server.');
							msg.channel.guild.channels.get(settings.banLog.channelID).getMessage(cases[0].messageID).then((message) => {
								message.edit(formatBanLogMessage(this.bot, msg.channel.guild, cases[0].user, args.slice(1).join(' '), Number(args[0]), cases[0].moderator ? cases[0].moderator : msg.author)).then(() => {
									msg.channel.createMessage(':white_check_mark:   **»**   Successfully updated case ' + args[0] + ' reason to `' + args.slice(1).join(' ') + '`.');
								}).catch(() => {
									msg.channel.createMessage(':exclamation:   **»**   Failed to update the ban log message. Do I have permission?');
								});
							}).catch(() => {
								msg.channel.createMessage(':exclamation:   **»**   Unable to find any messages by that case ID in the ban log.');
							});
						} else if (cases[0].type === 2) {
							if (!msg.channel.guild.channels.has(settings.kickLog.channelID)) return msg.channel.createMessage(':exclamation:   **»**   Unable to find the configured kick log channel in this server.');
							msg.channel.guild.channels.get(settings.kickLog.channelID).getMessage(cases[0].messageID).then((message) => {
								message.edit(formatKickLogMessage(this.bot, msg.channel.guild, cases[0].user, args.slice(1).join(' '), Number(args[0]), cases[0].moderator ? cases[0].moderator : msg.author)).then(() => {
									msg.channel.createMessage(':white_check_mark:   **»**   Successfully updated case ' + args[0] + ' reason to `' + args.slice(1).join(' ') + '`.');
								}).catch(() => {
									msg.channel.createMessage(':exclamation:   **»**   Failed to update the kick log message. Do I have permission?');
								});
							}).catch(() => {
								msg.channel.createMessage(':exclamation:   **»**   Unable to find any messages by that case ID in the kick log.');
							});
						}
					});
					
				});
			});
		});
	}
}

module.exports = Daily;