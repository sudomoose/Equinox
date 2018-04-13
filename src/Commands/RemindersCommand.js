const humanizeDuration = require('humanize-duration');
const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Reminders extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'reminders',
			aliases: [
				'managereminders'
			],
			description: 'Manages and delete your own reminders.',
			category: 'Utility',
			usage: 'reminders [<id>]',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg, args) {
		if (args.length > 0) {
			this.r.table('reminders').get(args[0]).run((error, reminder) => {
				if (error) return handleDatabaseError(error, msg);
				if (!reminder) return msg.channel.createMessage(':exclamation:   **»**   Unable to find any reminders by that ID.');
				this.r.table('reminders').get(args[0]).delete().run((error) => {
					if (error) return handleDatabaseError(error, msg);
					msg.channel.createMessage(':wastebasket:   **»**   Successfully deleted reminder for `' + reminder.message + '`.');
				});
			});
		} else {
			this.r.table('reminders').filter({ userID: msg.author.id }).run((error, reminders) => {
				if (error) return handleDatabaseError(error, msg);
				msg.channel.createMessage({
					embed: {
						title: 'Reminders',
						color: this.bot.embedColor,
						description: reminders.length > 0 ? reminders.map((reminder) => '`' + reminder.id + '` | `' + reminder.message + '` (' + humanizeDuration(reminder.end - Date.now(), { round: true, largest: 1 }) + ' left)').join('\n\n') : 'No reminders set.',
						footer: {
							text: 'Use "e!reminders <id>" to delete a reminder.'
						}
					}
				});
			});
		}
	}
}

module.exports = Reminders;