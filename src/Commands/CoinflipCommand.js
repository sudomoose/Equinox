const BaseCommand = require('../Structure/BaseCommand');

class Coinflip extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super({
			command: 'coin-flip',
			aliases: [
				'coinflip',
				'flip-coin',
				'flipcoin',
				'coin'
			],
			description: 'Flips a coin.',
			category: 'Fun',
			usage: 'coin-flip',
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
		if (Math.round(Math.random()) >= 0.5) {
			msg.channel.createMessage(':white_circle:   **»**   The coin landed on heads.');
		} else {
			msg.channel.createMessage(':black_circle:   **»**   The coin landed on tails.');
		}
	}
}

module.exports = Coinflip;