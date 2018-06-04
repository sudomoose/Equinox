const BaseCommand = require('../Structure/BaseCommand');

class Coinflip extends BaseCommand {
	constructor(bot, r, metrics) {
		super({
			command: 'coinflip',
			aliases: [
				'flipacoin',
				'coin'
			],
			description: 'Flips a coin.',
			category: 'Fun',
			usage: 'coinflip',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
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