const BaseCommand = require('../Structure/BaseCommand');
const config = require('../config.json');

class Support extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'support',
			aliases: [
				'support'
			],
			description: 'Gets the link to the support server.',
			category: 'Utility',
			usage: 'support',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg) {
		msg.channel.createMessage(':telephone:   **»**   Simply click the link to join our support server. Our moderators are happy to help! ' + config.links.server);
	}
}

module.exports = Support;