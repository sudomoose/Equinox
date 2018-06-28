const BaseCommand = require('../Structure/BaseCommand');
const formatSize = require('../Util/formatSize');
const formatDuration = require('../Util/formatDuration');
const DescriptionBuilder = require('../Structure/DescriptionBuilder');

class Statistics extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
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
		this.secondaryDB = secondaryDB;
	}

	execute(msg) {
		msg.channel.createMessage({
			embed: {
				title: 'Bot Statistics',
				color: this.bot.embedColor,
				description: new DescriptionBuilder().addField('Shards', this.bot.shards.size.toLocaleString()).addField('Guilds', this.bot.guilds.size.toLocaleString()).addField('Users', this.bot.users.size.toLocaleString()).addField('Voice Connections', this.bot.voiceConnections.size).addField('Memory Usage', formatSize(process.memoryUsage().heapUsed)).addField('Uptime', formatDuration(this.bot.uptime)).addField('Commands', this.bot.commands.size.toLocaleString()).build()
			}
		});
	}
}

module.exports = Statistics;