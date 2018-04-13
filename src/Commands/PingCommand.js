const BaseCommand = require('../Structure/BaseCommand');

class Ping extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'ping',
			aliases: [],
			description: 'Check how long it takes to send a message.',
			category: 'Utility',
			usage: 'ping',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg) {
		msg.channel.createMessage(':ping_pong:   **»**   Pinging...').then((m) => {
			m.edit(':ping_pong:   **»**   Pong! `' + (Date.now() - m.timestamp) + 'ms`');
		});
	}
}

module.exports = Ping;