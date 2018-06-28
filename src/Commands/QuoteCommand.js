const snekfetch = require('snekfetch');
const BaseCommand = require('../Structure/BaseCommand');
const Logger = require('../Util/Logger');

class Quote extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super({
			command: 'quote',
			aliases: [],
			description: 'Fetches a random quote.',
			category: 'Fun',
			usage: 'insult [<user...>]',
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
		snekfetch.get('https://talaikis.com/api/quotes/random/').then((result) => {
			msg.channel.createMessage(':scroll:   **»**   ' + result.body.quote + ' — *' + result.body.author + '*');
		}).catch((error) => {
			msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
			Logger.error(error);
		});
	}
}

module.exports = Quote;