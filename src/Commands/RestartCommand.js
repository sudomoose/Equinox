const child_process = require('child_process');
const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');
const config = require('../config.json');

class Restart extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'restart',
			aliases: [
				'res'
			],
			description: 'Restarts the bot.',
			category: 'Developers',
			usage: 'restart',
			hidden: true
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg) {
		this.r.table('developers').get(msg.author.id).run(async (error, developer) => {
			if (error) return handleDatabaseError(error, msg);
			if (!developer) return msg.channel.createMessage(':no_entry_sign:   **»**   You do not have permission to run this command.');
			this.r.table('intervals').insert({
				id: 'restart',
				channelID: msg.channel.id,
				userID: msg.author.id
			}, { conflict: 'replace' }).run((error) => {
				if (error) return handleDatabaseError(error, msg);
				msg.channel.createMessage(':arrows_counterclockwise:   **»**   Restarting the PM2 process...');
				child_process.exec('pm2 restart ' + config.pm2_process, (error) => {
					if (error) msg.channel.createMessage('```\n' + error + '```');
				});
			});
		});
	}
}

module.exports = Restart;
