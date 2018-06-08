const snekfetch = require('snekfetch');
const BaseCommand = require('../Structure/BaseCommand');
const formatSize = require('../Util/formatSize');
const formatDuration = require('../Util/formatDuration');

class Statistics extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'statistics',
			aliases: [
				'stats'
			],
			description: 'Sends detailed information about this bot.',
			category: 'Information',
			usage: 'statistics',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg) {
		snekfetch.get('https://api.github.com/repos/EquinoxBot/Equinox/commits').then((result) => {
			msg.channel.createMessage({
				embed: {
					title: 'Bot Statistics',
					color: this.bot.embedColor,
					description: result.body.slice(0, 3).map((commit) => '[`' + commit.sha.substr(0, 7) + '`](' + commit.html_url + ') ' + commit.commit.message).join('\n'),
					fields: [
						{
							name: 'Shards',
							value: this.bot.shards.size.toLocaleString(),
							inline: true
						},
						{
							name: 'Guilds',
							value: this.bot.guilds.size.toLocaleString(),
							inline: true
						},
						{
							name: 'Users',
							value: this.bot.users.size.toLocaleString(),
							inline: true
						},
						{
							name: 'Voice Connections',
							value: this.bot.voiceConnections.size.toLocaleString(),
							inline: true
						},
						{
							name: 'Memory Usage',
							value: formatSize(process.memoryUsage().heapUsed),
							inline: true
						},
						{
							name: 'Uptime',
							value: formatDuration(this.bot.uptime),
							inline: true
						},
						{
							name: 'Commands',
							value: this.bot.commands.size.toLocaleString(),
							inline: true
						}
					]
				}
			});
		});
	}
}

module.exports = Statistics;