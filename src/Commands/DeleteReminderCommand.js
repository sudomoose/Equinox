const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class DeleteReminder extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'delete-reminder',
			aliases: [
				'deletereminder'
			],
			description: 'Deletes a reminder that you\'ve created.',
			category: 'Reminders',
			usage: 'delete-reminder <id>',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a reminder ID to delete.');
		this.r.table('reminders').get(args[0]).run((error, reminder) => {
			if (error) return handleDatabaseError(error, msg);
			if (!reminder) return msg.channel.createMessage(':exclamation:   **»**   Unable to find any reminders by that ID.');
			if (reminder.userID !== msg.author.id) return msg.channel.createMessage(':no_entry_sign:   **»**   You cannot delete someone else\'s reminder.');
			this.r.table('reminders').get(args[0]).delete().run((error) => {
				if (error) return handleDatabaseError(error, msg);
				this.bot.reminders.get(reminder.id).stop();
				this.bot.reminders.delete(reminder.id);
				msg.channel.createMessage(':wastebasket:   **»**   Successfully deleted reminder for `' + reminder.message + '`.');
			});
		});
	}
}

module.exports = DeleteReminder;