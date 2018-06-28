const MessageHandler = require('../Structure/MessageHandler');

class CallHandler extends MessageHandler {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super(1);
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
		this.secondaryDB = secondaryDB;
	}

	execute(msg, next) {
		const calls = this.bot.calls.filter((call) => call.isCall(msg) && call.accepted);
		if (!msg.content.startsWith(msg.prefix) && calls.length > 0 && msg.content !== '') {
			calls[0].chat(msg);
		} else {
			next();
		}
	}
}

module.exports = CallHandler;