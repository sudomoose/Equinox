const BaseCommand = require('../Structure/BaseCommand');
const config = require('../config.json');

class Balance extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'source',
			aliases: [
				'src'
			],
			description: 'Gets the source of the bot on GitHub.',
			category: 'Utility',
			usage: 'source',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg) {
		msg.channel.createMessage(':gear:   **»**   ' + config.links.github);
	}
}

module.exports = Balance;