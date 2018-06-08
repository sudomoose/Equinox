const BaseCommand = require('../Structure/BaseCommand');

class Balance extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'invite',
			aliases: [
				'inv'
			],
			description: 'Get the invite to get Equinox added to your server.',
			category: 'Information',
			usage: 'invite',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg) {
		msg.channel.createMessage(':inbox_tray:   **»**   You can invite Equinox using the following link: <https://discordapp.com/oauth2/authorize?client_id=427139082284695569&scope=bot&permissions=8>.');
	}
}

module.exports = Balance;