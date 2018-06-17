const handleDatabaseError = require('../Util/handleDatabaseError');
const BaseCommand = require('../Structure/BaseCommand');
const resolveGuild = require('../Util/resolveGuild');

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
								name: 'Messages Sent',
								value: stats ? stats.messagesSent.toLocaleString() : 0,
								inline: true
							},
							{
								name: 'Word Count',
								value: stats ? stats.wordCount.toLocaleString() : 0,
								inline: true
							},
							{
								name: 'Character Count',
								value: stats ? stats.characterCount.toLocaleString() : 0,
								inline: true
							}
						]
					}
				});
			});
		}).catch(() => {
			msg.channel.createMessage(':exclamation:   **»**   Unable to find any servers by that query.');
		});
	}
}

module.exports = ServerStatistics;