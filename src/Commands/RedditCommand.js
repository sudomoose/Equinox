const snekfetch = require('snekfetch');
const BaseCommand = require('../Structure/BaseCommand');
const Logger = require('../Util/Logger');

class Reddit extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'reddit',
			aliases: [],
			description: 'Gets information about a subreddit.',
			category: 'Utility',
			usage: 'reddit <subreddit>',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a subreddit.');
		snekfetch.get('https://www.reddit.com/r/' + args[0] + '/about.json').then((result) => {
			if (!('display_name' in result.body.data)) return msg.channel.createMessage(':exclamation:   **»**   Unable to find a subreddit by that name.'); // dumb dumb reddit
			msg.channel.createMessage({
				embed: {
					title: result.body.data.display_name,
					color: this.bot.embedColor,
					description: result.body.data.public_description,
					url: 'https://www.reddit.com/r/' + args[0] + '/',
					thumbnail: {
						url: result.body.data.icon_img
					}
				}
			});
		}).catch((error) => {
			if (error.statusCode === 404) return msg.channel.createMessage(':exclamation:   **»**   Unable to find a subreddit by that name.');
			msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
			Logger.error('Failed to get subreddit', error);
		});
	}
}

module.exports = Reddit;