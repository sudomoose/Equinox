const Clever = require('cleverbot.io');
const BaseCommand = require('../Structure/BaseCommand');
const Logger = require('../Util/Logger');
const config = require('../config.json');

class Cleverbot extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super({
			command: 'cleverbot',
			aliases: [
				'clever'
			],
			description: 'Ask Artifical "Intelligence" a question.',
			category: 'Fun',
			usage: 'cleverbot <question...>',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
		this.secondaryDB = secondaryDB;
		this.clever = new Clever(config.api_keys.cleverbot.user, config.api_keys.cleverbot.key);
		this.clever.create((error, nick) => {
			if (error) throw error;
			this.clever.setNick(nick);
		});
	}

	execute(msg, args) {
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a question to ask clever.');
		msg.channel.sendTyping();
		this.clever.ask(args.join(' '), (error, response) => {
			if (error) {
				Logger.error('Failed to ask cleverbot a question', response);
				msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
				return;
			}
			msg.channel.createMessage(response);
		});
	}
}

module.exports = Cleverbot;