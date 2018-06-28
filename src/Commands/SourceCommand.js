const BaseCommand = require('../Structure/BaseCommand');
const config = require('../config.json');

class Balance extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super({
			command: 'source',
			aliases: [
				'src'
			],
			description: 'Gets the source of the bot on GitHub.',
			category: 'Information',
			usage: 'source',
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
		msg.channel.createMessage(':gear:   **»**   ' + config.links.github);
	}
}

module.exports = Balance;