const BaseCommand = require('../Structure/BaseCommand');
const config = require('../config.json');

class Support extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'support',
			aliases: [
				'support'
			],
			description: 'Gets the link to the support server.',
			category: 'Information',
			usage: 'support',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg) {
		msg.channel.createMessage(':telephone:   **»**   Simply click the link to join our support server. Our moderators are happy to help! ' + config.links.server);
	}
}

module.exports = Support;