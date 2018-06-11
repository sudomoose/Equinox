const fs = require('fs');
const util = require('util');
const path = require('path');
const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');
const Logger = require('../Util/Logger');

class Reload extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'reload',
			aliases: [
				'rel'
			],
			description: 'Reloads a command from file.',
			category: 'Developers',
			usage: 'reload <command>|all',
			hidden: true,
			guildOnly: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		this.r.table('developers').get(msg.author.id).run(async (error, developer) => {
			if (error) return handleDatabaseError(error, msg);
			if (!developer) return msg.channel.createMessage(':no_entry_sign:   **»**   You do not have permission to run this command.');
			if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a command name, or `all`.');
			if (args[0].toLowerCase() === 'all') {
				fs.readdir(__dirname, (error, files) => {
					if (error) {
						msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
						Logger.error(error);
						return;
					}
					for (let i = 0; i < files.length; i++) {
						try {
							delete require.cache[path.join(__dirname, files[i])];
							const Command = require(path.join(__dirname, files[i]));
							const command = new Command(this.bot, this.r, this.metrics, this.i18n);
							this.bot.commands.delete(command.command);
							command.file = path.join(__dirname, files[i]);
							this.bot.commands.set(command.command, command);
							if (i === files.length - 1) {
								msg.channel.createMessage(':arrows_counterclockwise:   **»**   Successfully reloaded ' + files.length + ' commands.');
							}
						} catch (e) {
							msg.channel.createMessage(':exclamation:   **»**   An error occured while trying to reload module.\n```js\n' + util.inspect(e) + '```');
						}
					}
				});
			} else {
				const commands = this.bot.commands.filter((command) => command.command.toLowerCase() === args[0].toLowerCase() || command.aliases.includes(args[0].toLowerCase()));
				if (commands.length < 1) return msg.channel.createMessage(':exclamation:   **»**   Unable to find any commands by that name.');
				try {
					delete require.cache[commands[0].file];
					const Command = require(commands[0].file);
					const command = new Command(this.bot, this.r, this.metrics, this.i18n);
					this.bot.commands.delete(command.command);
					command.file = commands[0].file;
					this.bot.commands.set(command.command, command);
					msg.channel.createMessage(':arrows_counterclockwise:   **»**   Command `' + command.command + '` has been reloaded.');
				} catch (e) {
					msg.channel.createMessage(':exclamation:   **»**   An error occured while trying to reload command.\n```js\n' + util.inspect(e) + '```');
				}
			}
		});
	}
}

module.exports = Reload;