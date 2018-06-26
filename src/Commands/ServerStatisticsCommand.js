const handleDatabaseError = require('../Util/handleDatabaseError');
const BaseCommand = require('../Structure/BaseCommand');
const resolveGuild = require('../Util/resolveGuild');
const DescriptionBuilder = require('../Structure/DescriptionBuilder');

class ServerStatistics extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'server-stats',
			aliases: [
				'serverstats',
				'server-statistics',
				'serverstatistics',
				'guild-stats',
				'guildstats',
				'guild-statistics',
				'guildstatistics'
			],
			description: 'Displays statistics about a channel.',
			category: 'Information',
			usage: 'channel-stats [<channel...>]',
			hidden: false,
			guildOnly: (msg, args) => args.length < 1
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		resolveGuild(this.bot, args.length > 0 ? args.join(' ') : msg.channel.guild.id).then((guild) => {
			this.r.table('server_statistics').get(guild.id).run((error, stats) => {
				if (error) return handleDatabaseError(error, msg);
				msg.channel.createMessage({
					embed: {
						title: 'Server Statistics',
						color: this.bot.embedColor,
						description: new DescriptionBuilder().addField('Name', guild.name).addField('ID', guild.id).addField('Messages Sent', stats ? stats.messagesSent.toLocaleString() : 0).addField('Word Count', stats ? stats.wordCount.toLocaleString() : 0).addField('Character Count', stats ? stats.characterCount.toLocaleString() : 0).build()
					}
				});
			});
		}).catch(() => {
			msg.channel.createMessage(':exclamation:   **»**   Unable to find any servers by that query.');
		});
	}
}

module.exports = ServerStatistics;