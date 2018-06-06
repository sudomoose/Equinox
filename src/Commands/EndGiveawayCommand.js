const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class EndGiveaway extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'endgiveaway',
			aliases: [
				'endga',
				'ega'
			],
			description: 'Ends a giveaway in your current channel.',
			category: 'Utility',
			usage: 'endgiveaway <message ID>',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		if (!msg.channel.guild) return msg.channel.createMessage(':no_entry_sign:   **»**   This command cannot be used in a direct message.');
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a message ID.');
		this.r.table('giveaways').get(args[0]).run((error, giveaway) => {
			if (error) return handleDatabaseError(error, msg);
			if (!giveaway) return msg.channel.createMessage(':exclamation:   **»**   Unable to find any giveaways by that message ID.');
			if (giveaway.creator !== msg.author.id) return msg.channel.createMessage(':exclamation:   **»**   You cannot end giveaways that you did not start.');
			this.r.table('giveaways').get(args[0]).update({ end: Date.now() }).run((error) => {
				if (error) return handleDatabaseError(error, msg);
				msg.channel.createMessage(':white_check_mark:   **»**   Successfully ended that giveaway. Please give it a moment to update.');
			});
		});
	}
}

module.exports = EndGiveaway;