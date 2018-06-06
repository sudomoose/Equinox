const MessageHandler = require('../Structure/MessageHandler');
const Logger = require('../Util/Logger');
const config = require('../config.json');
const WebhookClient = require('../Structure/WebhookClient');
const webhook = new WebhookClient(config.webhooks.commands.id, config.webhooks.commands.token);

class CommandHandler extends MessageHandler {
	constructor(bot, r, metrics, i18n) {
		super(3);
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, next) {
		if (!msg.content.startsWith(msg.prefix)) return next();
		const command = msg.content.split(' ')[0].replace(msg.prefix, '').toLowerCase();
		const commands = this.bot.commands.filter((c) => c.command === command || c.aliases.includes(command));
		const args = msg.content.replace(/ {2,}/g, ' ').replace(msg.prefix, '').split(' ').slice(1);
		if (commands.length > 0) {
			if (this.bot.user.id !== '336658909206937600' && !commands[0].hidden) webhook.send({
				title: 'A command was used',
				color: this.bot.embedColor,
				description: '**Command**: ' + command + '\n**Guild**: ' + (msg.channel.guild ? msg.channel.guild.name : 'N/A') + '\n**User**: ' + msg.author.username + '#' + msg.author.discriminator
			});
			this.metrics.increment('commands.top', 1, ['command:' + commands[0].command]);
			this.metrics.increment('commandsUsed');
			this.bot.statistics.commandUsage[commands[0].command] = (this.bot.statistics.commandUsage[commands[0].command] || 0) + 1;
			try {
				commands[0].execute(msg, args);
			} catch (e) {
				msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
				Logger.error('Failed to run command.', e);
			}
		}
	}
}

module.exports = CommandHandler;