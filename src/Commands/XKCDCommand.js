const snekfetch = require('snekfetch');
const BaseCommand = require('../Structure/BaseCommand');
const Logger = require('../Util/Logger');

class XKCD extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super({
			command: 'xkcd',
			aliases: [],
			description: 'View a random comic from xkcd.',
			category: 'Fun',
			usage: 'xkcd [<comic number>]',
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
		if (args.length > 0) {
			if (isNaN(args[0])) return msg.channel.createMessage(':exclamation:   **»**   The comic number must be a valid number.');
			if (Number(args[0]) < 1) return msg.channel.createMessage(':exclamation:   **»**   The comic number must be greater than or equal to 1.');
			snekfetch.get('https://xkcd.com/info.0.json').then((result) => {
				const max = result.body.num;
				if (Number(args[0]) > max) return msg.channel.createMessage(':exclamation:   **»**   The comic number must be less than or equal to ' + max.toLocaleString() + '.');
				snekfetch.get('https://xkcd.com/' + Number(args[0]) + '/info.0.json').then((result) => {
					msg.channel.createMessage({
						embed: {
							title: result.body.safe_title,
							description: result.body.alt,
							color: this.bot.embedColor,
							image: {
								url: result.body.img
							}
						}
					});
				}).catch((error) => {
					msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
					Logger.error(error);
				});
			}).catch((error) => {
				msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
				Logger.error(error);
			});
		} else {
			snekfetch.get('https://xkcd.com/info.0.json').then((result) => {
				const random = Math.floor(Math.random() * result.body.num) + 1;
				snekfetch.get('https://xkcd.com/' + random + '/info.0.json').then((result) => {
					msg.channel.createMessage({
						embed: {
							title: result.body.safe_title,
							description: result.body.alt,
							color: this.bot.embedColor,
							image: {
								url: result.body.img
							}
						}
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
}

module.exports = XKCD;