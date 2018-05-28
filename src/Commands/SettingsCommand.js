const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');
const config = require('../config.json');

class Settings extends BaseCommand {
	constructor(bot, r, metrics) {
		super({
			command: 'settings',
			aliases: [
				'config',
				'conf'
			],
			description: 'Adjust numerous settings within this server.',
			category: 'Moderation',
			usage: 'settings',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
	}

	execute(msg) {
		if (!msg.channel.guild) return msg.channel.createMessage(':no_entry_sign:   **»**   This command cannot be used in a direct message.');
		this.r.table('developers').get(msg.author.id).run((error, developer) => {
			if (error) return handleDatabaseError(error, msg);
			if (!msg.member.permission.has('manageGuild') && !developer) return msg.channel.createMessage(':no_entry_sign:   **»**   You need the `Manage Server` permission in order to use this command.');
			msg.channel.createMessage(':computer:   **»**   We have moved this command into our dashboard, which you can find here: <' + config.links.dashboard + '>.');
		});
	}
}

module.exports = Settings;