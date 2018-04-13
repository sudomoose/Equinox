const BaseCommand = require('../Structure/BaseCommand');

class Say extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'say',
			aliases: [],
			description: 'Sends whatever you tell it to say.',
			category: 'Fun',
			usage: 'remind <message...>',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg, args) {
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a message.');
		msg.channel.createMessage(args.join(' '));
	}
}

module.exports = Say;