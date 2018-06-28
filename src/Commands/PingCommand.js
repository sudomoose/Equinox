const BaseCommand = require('../Structure/BaseCommand');

class Ping extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super({
			command: 'ping',
			aliases: [],
			description: 'Check how long it takes to send a message.',
			category: 'Information',
			usage: 'ping',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
		this.secondaryDB = secondaryDB;
	}

	execute(msg) {
		msg.channel.createMessage(':ping_pong:   **»**   Pinging...').then((m) => {
			m.edit(':ping_pong:   **»**   Pong! `' + (Date.now() - m.timestamp) + 'ms`');
		});
	}
}

module.exports = Ping;