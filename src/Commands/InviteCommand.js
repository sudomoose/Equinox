const BaseCommand = require('../Structure/BaseCommand');

class Balance extends BaseCommand {
	constructor(bot, r, metrics) {
		super({
			command: 'invite',
			aliases: [
				'inv'
			],
			description: 'Get the invite to get Equinox added to your server.',
			category: 'General',
			usage: 'invite',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
	}

	execute(msg) {
		msg.channel.createMessage(':inbox_tray:   **»**   You can invite Equinox using the following link: <https://discordapp.com/oauth2/authorize?client_id=427139082284695569&scope=bot&permissions=8>.');
	}
}

module.exports = Balance;