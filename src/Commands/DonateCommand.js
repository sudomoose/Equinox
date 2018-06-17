const BaseCommand = require('../Structure/BaseCommand');
const config = require('../config.json');

class Donate extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'donate',
			aliases: [
				'patreon'
			],
			description: 'Gets the Patreon link to support the developers.',
			category: 'Information',
			usage: 'donate',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg) {
		msg.channel.createMessage(':inbox_tray:   **»**   Hosting ' + this.bot.user.username + ' costs money, especially with music, and that is why we need your help. You can donate monthly at Patreon: <' + config.links.donate + '>.');
	}
}

module.exports = Donate;