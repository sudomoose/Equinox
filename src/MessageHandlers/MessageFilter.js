const config = require('../config.json');
const MessageHandler = require('../Structure/MessageHandler');
const handleDatabaseError = require('../Util/handleDatabaseError');

class MessageFilter extends MessageHandler {
	constructor(bot, r, metrics, i18n) {
		super(0);
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, next) {
		if (!this.bot.ready || !msg.author || msg.author.bot) return;
		msg.prefix = msg.channel.guild && this.bot.prefixes.has(msg.channel.guild.id) ? this.bot.prefixes.get(msg.channel.guild.id) : config.default_prefix;
		msg.locale = msg.channel.guild && this.bot.locales.has(msg.channel.guild.id) ? this.bot.locales.get(msg.channel.guild.id) : config.default_locale;
		this.bot.statistics.messagesReceived++;
		this.r.table('user_statistics').get(msg.author.id).run((error, stats) => {
			if (error) return handleDatabaseError(error);
			if (stats) {
				this.r.table('user_statistics').get(msg.author.id).update({
					messagesSent: stats.messagesSent + 1,
					wordCount: stats.wordCount + msg.content.split(' ').length,
					characterCount: stats.characterCount + msg.content.length
				}).run((error) => {
					if (error) return handleDatabaseError(error);
				});
			} else {
				this.r.table('user_statistics').insert({
					id: msg.author.id,
					messagesSent: 1,
					wordCount: msg.content.split(' ').length,
					characterCount: msg.content.length
				}).run((error) => {
					if (error) return handleDatabaseError(error);
				});
			}
		});
		next();
	}
}

module.exports = MessageFilter;