const snekfetch = require('snekfetch');
const BaseCommand = require('../Structure/BaseCommand');
const resolveUser = require('../Util/resolveUser');
const Logger = require('../Util/Logger');

class DeleteReminder extends BaseCommand {
	constructor(bot, r, metrics) {
		super({
			command: 'insult',
			aliases: [],
			description: 'Insults a user or yourself.',
			category: 'Fun',
			usage: 'insult [<user...>]',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
	}

	execute(msg, args) {
		snekfetch.get('https://insult.mattbas.org/api/insult.json').then((result) => {
			if (args.length > 0) {
				resolveUser(this.bot, args.join(' ')).then((user) => {
					msg.channel.createMessage((msg.channel.guild && msg.channel.guild.members.has(user.id) ? '<@' + user.id + '>' : user.username + '#' + user.discriminator) + ' ' + JSON.parse(result.body).insult);
				}).catch(() => {
					msg.channel.createMessage(':exclamation:   **»**   Unable to find any users by that query.');
				});
			} else {
				msg.channel.createMessage('<@' + msg.author.id + '> ' + JSON.parse(result.body).insult);
			}
		}).catch((error) => {
			msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
			Logger.error(error);
		});
	}
}

module.exports = DeleteReminder;