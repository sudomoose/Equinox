const humanizeDuration = require('humanize-duration');
const BaseCommand = require('../Structure/BaseCommand');
const resolveUser = require('../Util/resolveUser');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Balance extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
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
		this.secondaryDB = secondaryDB;
	}

	execute(msg, args) {
		resolveUser(this.bot, args.length > 0 ? args.join(' ') : msg.author.id).then((user) => {
			this.secondaryDB.all('SELECT * FROM uptime WHERE userID = ?', msg.author.id, (error, uptime) => {
				if (error) return handleDatabaseError(error, msg);
				const members = this.bot.guilds.map((guild) => guild.members.get(user.id)).filter((member) => member);
				const duration = uptime.length > 0 ? ((uptime[0].duration + (uptime[0].status === 'online' ? Date.now() - uptime[0].since : 0)) / (Date.now() - uptime[0].timestamp)) : members.length > 0 ? (members[0].status !== 'offline' ? 1 : 0) : null;
				if (duration === null) return msg.channel.createMessage(':exclamation:   **»**   I am unable to find any uptime data on ' + user.username + '#' + user.discriminator + ' because they have not changed their status, and I do not share any servers with them.');
				msg.channel.createMessage(':watch:   **»**   ' + (msg.author.id === user.id ? 'You have' : user.username + '#' + user.discriminator + ' has') + ' been online for ' + (duration * 100).toFixed(1) + '% of the time, and ' + (msg.author.id === user.id ? 'have' : 'has') + ' been ' + (uptime.length > 0 ? uptime[0].status : members.length > 0 && members[0].status !== 'offline' ? 'online' : 'offline') + ' for ' + (uptime.length > 0 ? '`' + humanizeDuration(Date.now() - uptime[0].since, { round: true }) + '`' : 'an unknown duration') + '.');
			});
		}).catch(() => {
			msg.channel.createMessage(':exclamation:   **»**   Unable to find any users by that query.');
		});
	}
}

module.exports = Balance;