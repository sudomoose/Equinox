const BaseCommand = require('../Structure/BaseCommand');
const Logger = require('../Util/Logger');

class Prune extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'prune',
			aliases: [],
			description: 'Clears messages from the chat.',
			category: 'Moderation',
			usage: 'prune <amount> [<filters...>]',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg, args) {
		if (!msg.channel.guild) return msg.channel.createMessage(':no_entry_sign:   **»**   This command cannot be used in a direct message.');
		if (!msg.member.permission.has('manageMessages')) return msg.channel.createMessage(':no_entry_sign:   **»**   You need the `Manage Messages` permission in order to use this command.');
		if (!msg.channel.guild.members.get(this.bot.user.id).permission.has('manageMessages')) return msg.channel.createMessage(':no_entry_sign:   **»**   I need the `Manage Messages` permission in order to complete this command.');
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a prune amount');
		if (isNaN(args[0])) return msg.channel.createMessage(':exclamation:   **»**   The prune amount must be a valid number.');
		if (Number(args[0]) < 2) return msg.channel.createMessage(':exclamation:   **»**   The prune amount must be greater than or equal to 2.');
		if (Number(args[0]) > 100) return msg.channel.createMessage(':exclamation:   **»**   The prune amount must be less than or equal to 100.');
		msg.channel.getMessages(Number(args[0]), msg.id).then((messages) => {
			const filters = args.slice(1).join(' ').toLowerCase();
			if (args.length > 1) messages = messages.filter((message) => (filters.includes('bot') ? message.author.bot : true) && (filters.includes('user') ? !message.author.bot : true) && (filters.includes('attachment') ? message.attachments.length > 0 : true) && (filters.includes('embed') ? message.embeds.length > 0 : true) && (filters.includes('new') ? message.timestamp > (Date.now() - (1000 * 60 * 60 * 24 * 14)) : true));
			if (messages.length < 1) return msg.channel.createMessage(':exclamation:   **»**   There were no remaining messages after being filtered.');
			msg.channel.deleteMessages(messages.map((message) => message.id)).then(() => {
				msg.channel.createMessage(':white_check_mark:   **»**   Successfully pruned ' + messages.length + ' messages.');
			}).catch((error) => {
				if (error.message.includes(' is more than 2 weeks old.')) {
					msg.channel.createMessage(':exclamation:   **»**   There were ' + messages.filter((message) => message.timestamp < (Date.now() - (1000 * 60 * 60 * 24 * 14))).length + ' messages that could not be deleted because they are over 14 days old. Sorry, Discord restricts deleting those in bulk.');
				} else {
					Logger.error('Failed to prune messages', error);
					msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
				}
			});
		});
	}
}

module.exports = Prune;