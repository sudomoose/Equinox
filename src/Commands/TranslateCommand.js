const translate = require('google-translate-api');
const BaseCommand = require('../Structure/BaseCommand');
const Logger = require('../Util/Logger');

class Translate extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'translate',
			aliases: [],
			description: 'Translates text from one language to another.',
			category: 'Utility',
			usage: 'translate <language> <text...>',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a language code to translate to (e.g. `en` for English).');
		if (args.length < 2) return msg.channel.createMessage(':question:   **»**   You must provide text to translate.');
		translate(args.slice(1).join(' '), { to: 'en' }).then((result) => {
			msg.channel.createMessage(':scroll:   **»**   ' + result.text);
		}).catch((error) => {
			msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
			Logger.error('Failed to translate text', error);
		});
	}
}

module.exports = Translate;