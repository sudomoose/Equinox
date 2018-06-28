const BaseCommand = require('../Structure/BaseCommand');

class Say extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super({
			command: 'say',
			aliases: [],
			description: 'Sends whatever you tell it to say.',
			category: 'Fun',
			usage: 'say <message...>',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
		this.secondaryDB = secondaryDB;
	}

	execute(msg, args) {
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a message.');
		msg.channel.createMessage(args.join(' '));
	}
}

module.exports = Say;