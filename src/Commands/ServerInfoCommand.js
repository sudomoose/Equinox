const dateformat = require('dateformat');
const BaseCommand = require('../Structure/BaseCommand');
const resolveGuild = require('../Util/resolveGuild');
const DescriptionBuilder = require('../Structure/DescriptionBuilder');

class ServerInfo extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super({
			command: 'server-info',
			aliases: [
				'serverinfo',
				'server-information',
				'serverinformation',
				'server',
				'guild-info',
				'guildinfo',
				'guild-information',
				'guildinformation',
				'guild'
			],
			description: 'Displays information about a server.',
			category: 'Information',
			usage: 'serverinfo [<server...>]',
			hidden: false,
			guildOnly: (msg, args) => args.length < 1
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
		this.secondaryDB = secondaryDB;
	}

	execute(msg, args) {
		if (!msg.channel.guild && args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a server ID, or server name.');
		resolveGuild(this.bot, args.length > 0 ? args.join(' ') : msg.channel.guild.id).then((guild) => {
			msg.channel.createMessage({
				embed: {
					title: 'Server Information',
					color: this.bot.embedColor,
					description: new DescriptionBuilder().addField('Name', guild.name).addField('ID', guild.id).addField('Created At', dateformat(guild.createdAt, 'mm/dd/yyyy hh:MM:ss TT')).addField('Region', guild.region).addField('Owner', '<@' + guild.ownerID + '>').addField('Members', guild.memberCount).addField('Channels', guild.channels.size).addField('Emojis', guild.emojis.length).addField('Roles', guild.roles.size).build(),
					thumbnail: {
						url: guild.icon ? guild.iconURL : null
					}
				}
			});
		}).catch(() => {
			msg.channel.createMessage(':exclamation:   **»**   Unable to find any servers by that query.');
		});
	}
}

module.exports = ServerInfo;