const Eris = require('eris');
const BaseCommand = require('../Structure/BaseCommand');

class TestToken extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super({
			command: 'test-token',
			aliases: [
				'testtoken'
			],
			description: 'Tests a bot token by logging into Discord.',
			category: 'Utility',
			usage: 'testtoken <token>',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
		this.secondaryDB = secondaryDB;
	}

	execute(msg, args) {
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a Discord bot token to login with.');
		msg.channel.createMessage(':mag:   **»**   Logging in with token...').then((m) => {
			const client = new Eris(args[0]);
			client.on('ready', () => {
				m.edit(':white_check_mark:   **»**   Successfully logged in as `' + client.user.username + '#' + client.user.discriminator + ' (' + client.user.id + ')`. Connected to ' + client.guilds.size + ' servers and ' + client.users.size + ' users.');
				client.disconnect({
					reconnect: false
				});
			});
			client.on('disconnect', () => {
				m.edit(':exclamation:   **»**   Failed to login to bot. Most likely an invalid token.');
			});
			client.connect();
		});
	}
}

module.exports = TestToken;