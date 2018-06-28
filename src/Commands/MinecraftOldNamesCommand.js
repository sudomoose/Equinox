const snekfetch = require('snekfetch');
const BaseCommand = require('../Structure/BaseCommand');
const Logger = require('../Util/Logger');

class MinecraftOldNames extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super({
			command: 'mc-old-names',
			aliases: [
				'mcoldnames',
				'minecraft-old-names',
				'minecraftoldnames'
			],
			description: 'Gets previous usernames of a player using the username.',
			category: 'Information',
			usage: 'mc-old-names <username>',
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
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a username.');
		snekfetch.post('https://api.mojang.com/profiles/minecraft').send([ args[0] ]).then((result) => {
			if (result.body.length < 1) return msg.channel.createMessage(':exclamation:   **»**   Unable to find any players by that username.');
			snekfetch.get('https://api.mojang.com/user/profiles/' + result.body[0].id + '/names').then((names) => {
				if (names.body.length < 2) return msg.channel.createMessage(':exclamation:   **»**   `' + result.body[0].name + '` has had no previous usernames.');
				msg.channel.createMessage(':clipboard:   **»**   `' + result.body[0].name + '` has had the following names: `' + names.body.map((name) => name.name).join(' → ') + '`');
			}).catch((error) => {
				msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
				Logger.error('Failed to get server information', error);
			});
		}).catch((error) => {
			msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
			Logger.error('Failed to get server information', error);
		});
	}
}

module.exports = MinecraftOldNames;