const durationParser = require('duration-parser');
const humanizeDuration = require('humanize-duration');
const BaseCommand = require('../Structure/BaseCommand');
const Reminder = require('../Structure/Reminder');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Remind extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'remind',
			aliases: [
				'remindme',
				'setreminder'
			],
			description: 'Reminds you to do something at a specific time.',
			category: 'Utility',
			usage: 'remind <time> <message...>',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a duration.');
		if (args.length < 2) return msg.channel.createMessage(':question:   **»**   You must provide a message.');
		try {
			const duration = durationParser(args[0]);
			if (duration < 30000) return msg.channel.createMessage(':exclamation:   **»**   The duration time must be greater than or equal to 30 seconds.');
			const id = String(Math.floor(Math.random() * 1000000));
			const end = Date.now() + duration;
			this.r.table('reminders').insert({
				id,
				userID: msg.author.id,
				message: args.slice(1).join(' '),
				end,
				duration
			}, { returnChanges: true }).run((error, result) => {
				if (error) return handleDatabaseError(error, msg);
				msg.channel.createMessage(':alarm_clock:   **»**   Okay, I\'ll remind you in ' + humanizeDuration(duration, { round: true }) + ' to `' + args.slice(1).join(' ') + '`.');
				const reminder = result.changes[0].new_val;
				this.bot.reminders.set(reminder.id, new Reminder(this.bot, this.r, reminder));
			});
		} catch (e) {
			msg.channel.createMessage(':exclamation:   **»**   Unable to parse a duration from `' + args[0] + '`.');
		}
	}
}

module.exports = Remind;