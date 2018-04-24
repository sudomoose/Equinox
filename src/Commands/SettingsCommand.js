const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');
const updateSettings = require('../Util/updateSettings');
const resolveChannel = require('../Util/resolveChannel');
const resolveRole = require('../Util/resolveRole');

class Settings extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'settings',
			aliases: [
				'config',
				'conf'
			],
			description: 'Adjust numerous settings within this guild.',
			category: 'Moderation',
			usage: 'settings set|add|remove|list|tags [<setting name>] [<value...>]',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg, args) {
		if (!msg.channel.guild) return msg.channel.createMessage(':no_entry_sign:   **»**   This command cannot be used in a direct message.');
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide `set`, `unset`, or `list`.');
		this.r.table('settings').get(msg.channel.guild.id).run((error, settings) => {
			if (error) return handleDatabaseError(error, msg);
			if (!msg.member.permission.has('manageGuild')) return msg.channel.createMessage(':no_entry_sign:   **»**   You need the `Manage Server` permission in order to use thus command.');
			if (args[0].toLowerCase() === 'set') {
				if (args.length < 2) return msg.channel.createMessage(':question:   **»**   You must provide a setting name to modify.');
				if (args.length < 3) return msg.channel.createMessage(':question:   **»**   You must provide a new value to set.');
				if (args[1].toLowerCase() === 'joinmessages.enabled') {
					let enabled;
					if (args[2].toLowerCase() === 'true' || args[2].toLowerCase() === 'yes' || args[2].toLowerCase() === 'y') {
						enabled = true;
					} else if (args[2].toLowerCase() === 'false' || args[2].toLowerCase() === 'no' || args[2].toLowerCase() === 'n') {
						enabled = false;
					} else {
						msg.channel.createMessage(':exclamation:   **»**   Unknown argument `' + args[2].toLowerCase() + '`. Please refer to the command usage for more information.');
					}
					updateSettings(this.r, msg.channel.guild.id, { joinMessages: { enabled } }).then(() => {
						msg.channel.createMessage(':white_check_mark:   **»**   Successfully ' + (enabled ? 'enabled' : 'disabled') + ' join messages.');
					}).catch((error) => {
						handleDatabaseError(error, msg);
					});
				} else if (args[1].toLowerCase() === 'joinmessages.channel') {
					resolveChannel(this.bot, args.slice(2).join(' '), msg.channel.guild).then((channel) => {
						updateSettings(this.r, msg.channel.guild.id, { joinMessages: { channelID: channel.id } }).then(() => {
							msg.channel.createMessage(':white_check_mark:   **»**   Successfully set join messages to send in <#' + channel.id + '>.');
						}).catch((error) => {
							handleDatabaseError(error, msg);
						});
					}).catch(() => {
						msg.channel.createMessage(':exclamation:   **»**   Unable to find any channels by that query.');
					});
				} else if (args[1].toLowerCase() === 'joinmessages.message') {
					updateSettings(this.r, msg.channel.guild.id, { joinMessages: { message: args.slice(2).join(' ') } }).then(() => {
						msg.channel.createMessage(':white_check_mark:   **»**   Successfully set the join message to `' + args.slice(2).join(' ') + '`.');
					}).catch((error) => {
						handleDatabaseError(error, msg);
					});
				} else if (args[1].toLowerCase() === 'leavemessages.enabled') {
					let enabled;
					if (args[2].toLowerCase() === 'true' || args[2].toLowerCase() === 'yes' || args[2].toLowerCase() === 'y') {
						enabled = true;
					} else if (args[2].toLowerCase() === 'false' || args[2].toLowerCase() === 'no' || args[2].toLowerCase() === 'n') {
						enabled = false;
					} else {
						msg.channel.createMessage(':exclamation:   **»**   Unknown argument `' + args[2].toLowerCase() + '`. Please refer to the command usage for more information.');
					}
					updateSettings(this.r, msg.channel.guild.id, { leaveMessages: { enabled } }).then(() => {
						msg.channel.createMessage(':white_check_mark:   **»**   Successfully ' + (enabled ? 'enabled' : 'disabled') + ' leave messages.');
					}).catch((error) => {
						handleDatabaseError(error, msg);
					});
				} else if (args[1].toLowerCase() === 'leavemessages.channel') {
					resolveChannel(this.bot, args.slice(2).join(' '), msg.channel.guild).then((channel) => {
						updateSettings(this.r, msg.channel.guild.id, { leaveMessages: { channelID: channel.id } }).then(() => {
							msg.channel.createMessage(':white_check_mark:   **»**   Successfully set leave messages to send in <#' + channel.id + '>.');
						}).catch((error) => {
							handleDatabaseError(error, msg);
						});
					}).catch(() => {
						msg.channel.createMessage(':exclamation:   **»**   Unable to find any channels by that query.');
					});
				} else if (args[1].toLowerCase() === 'leavemessages.message') {
					updateSettings(this.r, msg.channel.guild.id, { leaveMessages: { message: args.slice(2).join(' ') } }).then(() => {
						msg.channel.createMessage(':white_check_mark:   **»**   Successfully set the leave message to `' + args.slice(2).join(' ') + '`.');
					}).catch((error) => {
						handleDatabaseError(error, msg);
					});
				} else if (args[1].toLowerCase() === 'autosnipe') {
					let enabled;
					if (args[2].toLowerCase() === 'true' || args[2].toLowerCase() === 'yes' || args[2].toLowerCase() === 'y') {
						enabled = true;
					} else if (args[2].toLowerCase() === 'false' || args[2].toLowerCase() === 'no' || args[2].toLowerCase() === 'n') {
						enabled = false;
					} else {
						msg.channel.createMessage(':exclamation:   **»**   Unknown argument `' + args[2].toLowerCase() + '`. Please refer to the command usage for more information.');
					}
					updateSettings(this.r, msg.channel.guild.id, { autoSnipe: enabled }).then(() => {
						msg.channel.createMessage(':white_check_mark:   **»**   Successfully ' + (enabled ? 'enabled' : 'disabled') + ' auto-snipe.');
					}).catch((error) => {
						handleDatabaseError(error, msg);
					});
				}
			} else if (args[0].toLowerCase() === 'add') {
				if (args.length < 2) return msg.channel.createMessage(':question:   **»**   You must provide a setting name to modify.');
				if (args.length < 3) return msg.channel.createMessage(':question:   **»**   You must provide a new value to set.');
				if (args[1].toLowerCase() === 'moderators') {
					resolveRole(this.bot, args.slice(2).join(' '), msg.channel.guild).then((role) => {
						if (settings && settings.moderators.includes(role.id)) return msg.channel.createMessage(':exclamation:   **»**   That role is already considered a moderator.');
						const moderators = settings ? settings.moderators : [];
						moderators.push(role.id);
						updateSettings(this.r, msg.channel.guild.id, { moderators }).then(() => {
							msg.channel.createMessage(':white_check_mark:   **»**   Successfully added `' + role.name + '` to the list of moderators.');
						}).catch((error) => {
							handleDatabaseError(error, msg);
						});
					}).catch(() => {
						msg.channel.createMessage(':exclamation:   **»**   Unable to find any roles by that query.');
					});
				}
			} else if (args[0].toLowerCase() === 'remove') {
				if (args.length < 2) return msg.channel.createMessage(':question:   **»**   You must provide a setting name to modify.');
				if (args.length < 3) return msg.channel.createMessage(':question:   **»**   You must provide a new value to set.');
				if (args[1].toLowerCase() === 'moderators') {
					resolveRole(this.bot, args.slice(2).join(' '), msg.channel.guild).then((role) => {
						if (settings && settings.moderators.includes(role.id)) return msg.channel.createMessage(':exclamation:   **»**   That role is already considered a moderator.');
						const moderators = settings ? settings.moderators : [];
						moderators.push(role.id);
						updateSettings(this.r, msg.channel.guild.id, { moderators }).then(() => {
							msg.channel.createMessage(':white_check_mark:   **»**   Successfully enabled join messages.');
						}).catch((error) => {
							handleDatabaseError(error, msg);
						});
					});
				}
			} else if (args[0].toLowerCase() === 'list') {
				msg.channel.createMessage('```\nJoin Messages\n    Enabled: ' + (settings && settings.joinMessages.enabled ? 'Yes' : 'No') + '\n    Channel: ' + (settings && settings.joinMessages.channelID ? (msg.channel.guild.channels.has(settings.joinMessages.channelID) ? '#' + msg.channel.guild.channels.get(settings.joinMessages.channelID).name + ' (' + settings.joinMessages.channelID + ')' : 'Unknown channel') : 'Not set') + '\n    Message: ' + (settings && settings.joinMessages.message ? 'Configured' : 'Not set') + '\n\nLeave Messages\n    Enabled: ' + (settings && settings.leaveMessages.enabled ? 'Yes' : 'No') + '\n    Channel: ' + (settings && settings.leaveMessages.channelID ? (msg.channel.guild.channels.has(settings.leaveMessages.channelID) ? '#' + msg.channel.guild.channels.get(settings.leaveMessages.channelID).name + ' (' + settings.leaveMessages.channelID + ')' : 'Unknown channel') : 'Not set') + '\n    Message: ' + (settings && settings.leaveMessages.message ? 'Configured' : 'Not set') + '\n\nAutosnipe: ' + (settings && settings.autoSnipe ? 'Enabled' : 'Disabled') + '\n\nAdjust settings by using "' + msg.prefix + 'settings set <category>.<setting> <value>" (example: ' + msg.prefix + 'settings set joinmessages.enabled yes)```');
			} else if (args[0].toLowerCase() === 'tags') {
				msg.channel.createMessage('```md\n{user.id} - The user\'s ID.\n{user.username} - The username of the user.\n{user.discriminator} - The four digit number following the username.\n{user.tag} - The full username and discriminator of the user.\n{user.createdAt.time} - The time in which the user created their account.\n{user.createdAt.date} - The date in which the user created their account.\n{user.createdAt.datetime} - The date and time in which the user created their account.\n{user.avatarURL} - The full avatar URL of the user.\n{user.joinedAt.time} - The time that the user joined the server.\n{user.joinedAt.date} - The date that the user joined the server.\n{user.joinedAt.datetime} - The date and time that the user joined the server.\n{date} - The current date.\n{time} - The current time.\n{datetime} - The current data and time.\n{guild.name} - The name of the server.\n{guild.id} - The ID of the server.\n{guild.members} - The total user count in the server.\n{guild.roles} - The amount of roles in the server.\n{guild.emojis} - The amount of emojis in the server.\n{guild.createdAt.time} - The time in which the server was created.\n{guild.createdAt.date} - The date in which the server was created.\n{guild.createdAt.datetime} - The date and time in which the server was created.```');
			} else {
				msg.channel.createMessage(':exclamation:   **»**   Unknown argument `' + args[0].toLowerCase() + '`. Please refer to the command usage for more information.');
			}
		});
	}
}

module.exports = Settings;