const humanizeDuration = require('humanize-duration');
const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Reminders extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'reminders',
			aliases: [
				'managereminders'
			],
			description: 'Manages and delete your own reminders.',
			category: 'Utility',
			usage: 'reminders',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg) {
		this.r.table('reminders').filter({ userID: msg.author.id }).run((error, reminders) => {
			if (error) return handleDatabaseError(error, msg);
			msg.channel.createMessage({
				embed: {
					title: 'Reminders',
					color: this.bot.embedColor,
					description: reminders.length > 0 ? reminders.map((reminder) => '`' + reminder.id + '` | `' + reminder.message + '` (' + humanizeDuration(reminder.end - Date.now(), { round: true, largest: 1 }) + ' left)').join('\n\n') : 'No reminders set.',
					footer: {
						text: 'Use "e!deletereminder <id>" to delete a reminder.'
					}
				}
			});
		});
	}
}

module.exports = Reminders;