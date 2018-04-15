const BaseCommand = require('../Structure/BaseCommand');
const resolveUser = require('../Util/resolveUser');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Balance extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'uptime',
			aliases: [],
			description: 'See how long a user has been online for.',
			category: 'Utility',
			usage: 'uptime [<user...>]',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg, args) {
		if (args.length > 0) {
			resolveUser(this.bot, args.join(' ')).then((user) => {
				this.r.table('uptime').get(msg.author.id).run((error, uptime) => {
					if (error) return handleDatabaseError(error, msg);
					msg.channel.createMessage(':watch:   **»**   ' + user.username + '#' + user.discriminator + ' has been online for ' + (uptime.status === 'online' ? (((Date.now() - uptime.since) + uptime.duration) / (Date.now() - uptime.timestamp)) * 100 : (uptime.duration / (Date.now() - uptime.timestamp)) * 100).toFixed(1) + '% of the time.');
				});
			}).catch(() => {
				msg.channel.createMessage(':exclamation:   **»**   Unable to find any users by that query.');
			});
		} else {
			this.r.table('uptime').get(msg.author.id).run((error, uptime) => {
				if (error) return handleDatabaseError(error, msg);
				msg.channel.createMessage(':watch:   **»**   You\'ve been online for ' + (uptime.status === 'online' ? (((Date.now() - uptime.since) + uptime.duration) / (Date.now() - uptime.timestamp)) * 100 : (uptime.duration / (Date.now() - uptime.timestamp)) * 100).toFixed(1) + '% of the time.');
			});
		}
	}
}

module.exports = Balance;