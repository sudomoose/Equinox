const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class DeleteReminder extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'deletereminder',
			aliases: [
				'delete-reminder',
				'delreminder'
			],
			description: 'Deletes a reminder that you\'ve created.',
			category: 'Utility',
			usage: 'deletereminder <id>',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg, args) {
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a reminder ID to delete.');
		this.r.table('reminders').get(args[0]).run((error, reminder) => {
			if (error) return handleDatabaseError(error, msg);
			if (!reminder) return msg.channel.createMessage(':exclamation:   **»**   Unable to find any reminders by that ID.');
			this.r.table('reminders').get(args[0]).delete().run((error) => {
				if (error) return handleDatabaseError(error, msg);
				msg.channel.createMessage(':wastebasket:   **»**   Successfully deleted reminder for `' + reminder.message + '`.');
			});
		});
	}
}

module.exports = DeleteReminder;