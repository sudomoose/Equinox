const humanizeDuration = require('humanize-duration');
const BaseCommand = require('../Structure/BaseCommand');
const resolveUser = require('../Util/resolveUser');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Balance extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'uptime',
			aliases: [],
			description: 'See how long a user has been online for.',
			category: 'Utility',
			usage: 'uptime [<user...>]',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		resolveUser(this.bot, args.length > 0 ? args.join(' ') : msg.author.id).then((user) => {
			this.r.table('uptime').get(msg.author.id).run((error, uptime) => {
				if (error) return handleDatabaseError(error, msg);
				const duration = uptime ? (uptime.status === 'online' ? ((Date.now() - uptime.since) + uptime.duration) : uptime.duration) / (Date.now() - uptime.timestamp) : 0;
				msg.channel.createMessage(':watch:   **»**   ' + (msg.author.id === user.id ? 'You have' : user.username + '#' + user.discriminator + ' has') + ' been online for ' + (duration * 100).toFixed(1) + '% of the time, and ' + (msg.author.id === user.id ? 'have' : 'has') + ' been ' + (uptime ? uptime.status : 'offline') + ' for ' + (uptime ? '`' + humanizeDuration(Date.now() - uptime.since, { round: true }) + '`' : ' an unknown duration') + '.');
			});
		}).catch(() => {
			msg.channel.createMessage(':exclamation:   **»**   Unable to find any users by that query.');
		});
	}
}

module.exports = Balance;