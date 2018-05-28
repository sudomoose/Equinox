const dateformat = require('dateformat');
const BaseCommand = require('../Structure/BaseCommand');
const resolveGuild = require('../Util/resolveGuild');

class ServerInfo extends BaseCommand {
	constructor(bot, r, metrics) {
		super({
			command: 'serverinfo',
			aliases: [
				'server',
				'guildinfo',
				'guild'
			],
			description: 'Displays information about a server.',
			category: 'Information',
			usage: 'serverinfo [<server...>]',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
	}

	execute(msg, args) {
		if (!msg.channel.guild && args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a server ID, or server name.');
		resolveGuild(this.bot, args.length > 0 ? args.join(' ') : msg.channel.guild.id).then((guild) => {
			msg.channel.createMessage({
				embed: {
					title: 'Server Information',
					color: this.bot.embedColor,
					thumbnail: {
						url: guild.icon ? guild.iconURL : null
					},
					fields: [
						{
							name: 'Name',
							value: guild.name,
							inline: true
						},
						{
							name: 'ID',
							value: guild.id,
							inline: true
						},
						{
							name: 'Created At',
							value: dateformat(guild.createdAt, 'mm/dd/yyyy hh:MM:ss TT'),
							inline: true
						},
						{
							name: 'Region',
							value: guild.region,
							inline: true
						},
						{
							name: 'Owner',
							value: '<@' + guild.ownerID + '>',
							inline: true
						},
						{
							name: 'Members',
							value: guild.memberCount,
							inline: true
						},
						{
							name: 'Channels',
							value: guild.channels.size,
							inline: true
						},
						{
							name: 'Emojis',
							value: guild.emojis.length,
							inline: true
						},
						{
							name: 'Roles',
							value: guild.roles.size,
							inline: true
						}
					]
				}
			});
		}).catch(() => {
			msg.channel.createMessage(':exclamation:   **»**   Unable to find any servers by that query.');
		});
	}
}

module.exports = ServerInfo;