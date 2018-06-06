const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Snipe extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'snipe',
			aliases: [
				'snipp'
			],
			description: 'Snipes the last deleted messages.',
			category: 'Utility',
			usage: 'snipe [opt-out|opt-in]',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		if (args.length > 0) {
			if (args[0].toLowerCase() === 'opt-out' || args[0].toLowerCase() === 'optout') {
				this.r.table('snipe_opt_out').get(msg.author.id).run((error, result) => {
					if (error) return handleDatabaseError(error, msg);
					if (result) return msg.channel.createMessage(':exclamation:   **»**   You are already opt-out from being snipe-able.');
					this.r.table('snipe_opt_out').insert({
						id: msg.author.id
					}).run((error) => {
						if (error) return handleDatabaseError(error, msg);
						msg.channel.createMessage(':white_check_mark:   **»**   Your messages will no longer be logged for snipe-age.');
					});
				});
			} else if (args[0].toLowerCase() === 'opt-in' || args[0].toLowerCase() == 'optin') {
				this.r.table('snipe_opt_out').get(msg.author.id).run((error, result) => {
					if (error) return handleDatabaseError(error, msg);
					if (!result) return msg.channel.createMessage(':exclamation:   **»**   You are already opt-in for being snipe-able.');
					this.r.table('snipe_opt_out').get(msg.author.id).delete().run((error) => {
						if (error) return handleDatabaseError(error, msg);
						msg.channel.createMessage(':white_check_mark:   **»**   Your messages will now be logged for snipe-age.');
					});
				});
			} else {
				msg.channel.createMessage(':exclamation:   **»**   Unknown argument `abc`. Please refer to the command usage for more information.');
			}
		} else {
			this.r.table('snipes').get(msg.channel.id).run((error, snipe) => {
				if (error) return handleDatabaseError(error, msg);
				if (!snipe) return msg.channel.createMessage(':exclamation:   **»**   There are no snipes in this channel.');
				this.r.table('snipes').get(msg.channel.id).delete().run((error) => {
					if (error) return handleDatabaseError(error, msg);
					const structure = {
						author: {
							name: snipe.author.username + '#' + snipe.author.discriminator + ' (' + snipe.author.id + ')',
							icon_url: snipe.author.avatarURL || snipe.author.defaultAvatarURL
						},
						color: this.bot.embedColor,
						footer: {
							text: 'Sniped by ' + msg.author.username + '#' + msg.author.discriminator
						},
						timestamp: new Date(snipe.timestamp).toISOString()
					};
					if (snipe.content instanceof Object) {
						structure.description = snipe.description;
						if ('fields' in snipe.content) structure.fields = snipe.content.fields;
						if ('title' in snipe.content) structure.title = snipe.content.title;
						if ('color' in snipe.content) structure.color = snipe.content.color;
						if ('url' in snipe.content) structure.url = snipe.content.url;
						if ('image' in snipe.content) structure.image = snipe.content.image;
					} else {
						structure.description = snipe.content;
					}
					msg.channel.createMessage({
						embed: structure
					});
				});
			});
		}
	}
}

module.exports = Snipe;
