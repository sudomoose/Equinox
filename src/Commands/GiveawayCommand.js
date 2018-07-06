const parseDuration = require('parse-duration');
const humanizeDuration = require('humanize-duration');
const dateformat = require('dateformat');
const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');
const handleGiveaway = require('../Util/handleGiveaway');
const DescriptionBuilder = require('../Structure/DescriptionBuilder');

class Giveaway extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super({
			command: 'create-giveaway',
			aliases: [
				'creategiveaway'
			],
			description: 'Create a giveaway in your current channel.',
			category: 'Utility',
			usage: 'creategiveaway <duration> <winners> <item...>',
			hidden: false,
			guildOnly: true
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
		this.secondaryDB = secondaryDB;
	}

	execute(msg, args) {
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
					description: new DescriptionBuilder().addField('Prize', args.slice(2).join(' ')).addField('Winners', args[1]).addField('Time Remaining', humanizeDuration(duration)).addField('Ends At', dateformat(Date.now() + duration, 'mm/dd/yyyy hh:MM:ss TT (HH:MM:ss)')).addField('Status', 'Active').build()
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
			msg.channel.createMessage(':exclamation:   **»**   The duration must be a valid duration.');
		}
	}
}

module.exports = Giveaway;
