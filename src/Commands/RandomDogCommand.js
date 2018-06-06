const snekfetch = require('snekfetch');
const BaseCommand = require('../Structure/BaseCommand');
const Logger = require('../Util/Logger');

class DeleteReminder extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'dog',
			aliases: [
				'randomdog'
			],
			description: 'Gets a random dog picture from the internet.',
			category: 'Fun',
			usage: 'dog',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg) {
		snekfetch.get('https://dog.ceo/api/breeds/image/random').then((result) => {
			snekfetch.get(result.body.message).then((result) => {
				msg.channel.createMessage('', {
					name: 'dog.png',
					file: result.body
				});
			}).catch((error) => {
				msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
				Logger.error(error);
			});
		}).catch((error) => {
			msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
			Logger.error(error);
		});
	}
}

module.exports = DeleteReminder;