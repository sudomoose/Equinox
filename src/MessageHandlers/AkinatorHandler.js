const MessageHandler = require('../Structure/MessageHandler');

class AkinatorHandler extends MessageHandler {
	constructor(bot, r, metrics, i18n) {
		super(2);
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, next) {
		next();
	}
}

module.exports = AkinatorHandler;