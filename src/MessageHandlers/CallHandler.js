const MessageHandler = require('../Structure/MessageHandler');

class CallHandler extends MessageHandler {
	constructor(bot, r, metrics, i18n) {
		super(1);
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, next) {
		console.log(this.bot.calls);
		const calls = this.bot.calls.filter((call) => (call.callerChannelID === msg.channel.id || call.calleeChannelID === msg.channel.id) && call.accepted);
		if (!msg.content.startsWith(msg.prefix) && calls.length > 0 && msg.content !== '') {
			const call = calls[0];
			if (msg.channel.id === call.callerChannelID) {
				this.bot.guilds.get(this.bot.channelGuildMap[call.calleeChannelID]).channels.get(call.calleeChannelID).createMessage('**' + msg.author.username + '#' + msg.author.discriminator + '**: ' + msg.content);
			} else {
				this.bot.guilds.get(this.bot.channelGuildMap[call.callerChannelID]).channels.get(call.callerChannelID).createMessage('**' + msg.author.username + '#' + msg.author.discriminator + '**: ' + msg.content);
			}
		} else {
			next();
		}
	}
}

module.exports = CallHandler;