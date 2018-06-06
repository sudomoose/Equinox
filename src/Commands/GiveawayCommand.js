const parseDuration = require('parse-duration');
const humanizeDuration = require('humanize-duration');
const dateformat = require('dateformat');
const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');
const handleGiveaway = require('../Util/handleGiveaway');

class Giveaway extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'creategiveaway',
			aliases: [
				'createga',
				'cga'
			],
			description: 'Create a giveaway in your current channel.',
			category: 'Utility',
			usage: 'creategiveaway <duration> <winners> <item...>',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		if (!msg.channel.guild) return msg.channel.createMessage(':no_entry_sign:   **»**   This command cannot be used in a direct message.');
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a duration.');
		if (args.length < 2) return msg.channel.createMessage(':question:   **»**   You must provide an amount of winners.');
		if (isNaN(args[1])) return msg.channel.createMessage(':exclamation:   **»**   The amount of winners must be a valid number.');
		if (Number(args[1]) < 1) return msg.channel.createMessage(':exclamation:   **»**   The amount of winners must be greater than or equal to 1.');
		if (args.length < 3) return msg.channel.createMessage(':question:   **»**   You must provide an item that will be won.');
		try {
			const duration = parseDuration(args[0]);
			msg.channel.createMessage({
				embed: {
					title: ':tada: Giveaway :tada:',
					color: 0x00FF00,
					description: '**Prize**: ' + args.slice(2).join(' ') + '\n\n**Winners**: ' + args[1] + '\n\n**Time Remaining**: ' + humanizeDuration(duration) + '\n\n**Ends At**: ' + dateformat(Date.now() + duration, 'mm/dd/yyyy hh:MM:ss TT (HH:MM:ss)')
				}
			}).then((message) => {
				message.addReaction('🎉').catch(() => {
					msg.channel.createMessage(':exclamation:   **»**   Failed to react with the initial :tada: emoji.');
				});
				this.r.table('giveaways').insert({
					id: message.id,
					channelID: msg.channel.id,
					timestamp: Date.now(),
					end: Date.now() + duration,
					duration,
					winners: Number(args[1]),
					prize: args.slice(2).join(' '),
					creator: msg.author.id,
					cancelled: false
				}).run((error) => {
					if (error) return handleDatabaseError(error, msg);
					msg.delete().catch(() => {});
					handleGiveaway(this.bot, this.r, message.id);
				});
			});
		} catch (e) {
			msg.channel.createMessage(':exclamation:   **»**   The durtion must be a valid duration.');
		}
	}
}

module.exports = Giveaway;