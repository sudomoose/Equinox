const config = require('../config.json');
const MessageHandler = require('../Structure/MessageHandler');

class MessageFilter extends MessageHandler {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super(0);
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
		this.secondaryDB = secondaryDB;
	}

	execute(msg, next) {
		if (!this.bot.ready || !msg.author || msg.author.bot) return;
		msg.prefix = msg.channel.guild && this.bot.prefixes.has(msg.channel.guild.id) ? this.bot.prefixes.get(msg.channel.guild.id) : config.default_prefix;
		msg.locale = msg.channel.guild && this.bot.locales.has(msg.channel.guild.id) ? this.bot.locales.get(msg.channel.guild.id) : config.default_locale;
		this.bot.statistics.messagesReceived++;
		if (msg.author.id in this.bot.queuedQueries.userStatistics) {
			this.bot.queuedQueries.userStatistics[msg.author.id].characterCount += msg.content.length;
			this.bot.queuedQueries.userStatistics[msg.author.id].wordCount += msg.content.split(' ').length;
			this.bot.queuedQueries.userStatistics[msg.author.id].messagesSent += 1;
		} else {
			this.bot.queuedQueries.userStatistics[msg.author.id] = {
				characterCount: msg.content.length,
				wordCount: msg.content.split(' ').length,
				messagesSent: 1
			};
		}
		if (msg.channel.guild) {
			if (msg.channel.id in this.bot.queuedQueries.channelStatistics) {
				this.bot.queuedQueries.channelStatistics[msg.channel.id].characterCount += msg.content.length;
				this.bot.queuedQueries.channelStatistics[msg.channel.id].wordCount += msg.content.split(' ').length;
				this.bot.queuedQueries.channelStatistics[msg.channel.id].messagesSent += 1;
			} else {
				this.bot.queuedQueries.channelStatistics[msg.channel.id] = {
					characterCount: msg.content.length,
					wordCount: msg.content.split(' ').length,
					messagesSent: 1
				};
			}
			if (msg.channel.guild.id in this.bot.queuedQueries.serverStatistics) {
				this.bot.queuedQueries.channelStatistics[msg.channel.guild.id].characterCount += msg.content.length;
				this.bot.queuedQueries.channelStatistics[msg.channel.guild.id].wordCount += msg.content.split(' ').length;
				this.bot.queuedQueries.channelStatistics[msg.channel.guild.id].messagesSent += 1;
			} else {
				this.bot.queuedQueries.channelStatistics[msg.channel.guild.id] = {
					characterCount: msg.content.length,
					wordCount: msg.content.split(' ').length,
					messagesSent: 1
				};
			}
		}
		next();
	}
}

module.exports = MessageFilter;