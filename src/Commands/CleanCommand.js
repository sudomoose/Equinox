const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');
const Logger = require('../Util/Logger');

class Clean extends BaseCommand {
	constructor(bot, r, metrics) {
		super({
			command: 'clean',
			aliases: [],
			description: 'Cleans Equinox\'s messages from chat.',
			category: 'Developers',
			usage: 'clean <amount>',
			hidden: true
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
	}

	execute(msg, args) {
		this.r.table('developers').get(msg.author.id).run((error, developer) => {
			if (error) return handleDatabaseError(error, msg);
			if (!developer) return msg.channel.createMessage(':no_entry_sign:   **»**   You do not have permission to run this command.');
			if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a clean amount.');
			if (isNaN(args[0])) return msg.channel.createMessage(':exclamation:   **»**   The clean amount must be a valid number.');
			if (Number(args[0]) < 2) return msg.channel.createMessage(':exclamation:   **»**   The clean amount must be greater than or equal to 2.');
			if (Number(args[0]) > 100) return msg.channel.createMessage(':exclamation:   **»**   The clean amount must be less than or equal to 100.');
			msg.channel.getMessages(Number(args[0]), msg.id).then((messages) => {
				messages = messages.filter((message) => message.author.id === this.bot.user.id);
				msg.channel.deleteMessages(messages.map((message) => message.id)).then(() => {
					msg.channel.createMessage(':white_check_mark:   **»**   Successfully cleaned `' + messages.length + '` messages.').then((m) => {
						setTimeout(() => {
							m.delete();
							msg.delete().catch(() => {});
						}, 1200);
					});
				}).catch(() => {
					msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
					Logger.error(error);
				});
			}).catch(() => {
				msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
				Logger.error(error);
			});
		});
	}
}

module.exports = Clean;
