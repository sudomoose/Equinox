const snekfetch = require('snekfetch');
const Logger = require('../Util/Logger');
const BaseCommand = require('../Structure/BaseCommand');

class NumberFact extends BaseCommand {
	constructor(bot, r, metrics) {
		super({
			command: 'numberfact',
			aliases: [
				'numfact'
			],
			description: 'Gives you a fact about a number.',
			category: 'Fun',
			usage: 'numberfact [<number>]',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
	}

	execute(msg, args) {
		if (args.length > 0 && !/^\d+$/.test(args[0])) return msg.channel.createMessage(':exclamation:   **»**   The fact number must be a valid number.');
		snekfetch.get('http://numbersapi.com/' + (args.length > 0 ? args[0] : 'random') + '?default=404').then((result) => {
			if (result.body.toString() === '404') {
				msg.channel.createMessage(':exclamation:   **»**   Unable to find any facts by that number.');
			} else {
				msg.channel.createMessage(':mag:   **»**   ' + result.body.toString());
			}
		}).catch((error) => {
			Logger.error('Failed to get a number fact.', error);
			msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
		});
	}
}

module.exports = NumberFact;