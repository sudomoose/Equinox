const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Snipe extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'snipe',
			aliases: [
				'snipp'
			],
			description: 'Snipes the last deleted messages.',
			category: 'Utility',
			usage: 'snipe',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg) {
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
					structure.description = snipe.content.description;
					if ('fields' in snipe.content) structure.content.fields = snipe.content.fields;
					if ('title' in snipe.content) structure.content.title = snipe.content.title;
					if ('color' in snipe.content) structure.content.color = snipe.content.color;
					if ('url' in snipe.content) structure.content.url = snipe.content.url;
					if ('image' in snipe.content) structure.content.image = snipe.content.image;
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

module.exports = Snipe;
