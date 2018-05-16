const Logger = require('../Util/Logger.js');
const handleDatabaseError = require('../Util/handleDatabaseError');
const WebhookClient = require('../Structure/WebhookClient');
const config = require('../config.json');
const webhook = new WebhookClient(config.webhooks.commands.id, config.webhooks.commands.token);

module.exports = (bot, r, metrics) => {
	bot.on('messageCreate', (msg) => {
		bot.statistics.messagesReceived++;
		if (!bot.ready || !msg.author || msg.author.bot) return;
		let prefix = msg.channel.guild && bot.prefixes.has(msg.channel.guild.id) ? bot.prefixes.get(msg.channel.guild.id) : config.default_prefix;
		if (!msg.content.startsWith(prefix)) return;
		msg.prefix = prefix;
		const command = msg.content.split(' ')[0].replace(prefix, '').toLowerCase();
		const commands = bot.commands.filter((c) => c.command === command || c.aliases.includes(command));
		const args = msg.content.replace(/ {2,}/g, ' ').replace(prefix, '').split(' ').slice(1);
		if (commands.length > 0) {
			if (bot.user.id !== '336658909206937600' && !commands[0].hidden) webhook.send({
				title: 'A command was used',
				color: bot.embedColor,
				description: '**Command**: ' + command + '\n**Guild**: ' + (msg.channel.guild ? msg.channel.guild.name : 'N/A') + '\n**User**: ' + msg.author.username + '#' + msg.author.discriminator
			});
			r.table('commands').insert({
				timestamp: Date.now(),
				userID: msg.author.id,
				channelID: msg.channel.guild ? msg.channel.id : null,
				guildID: msg.channel.guild ? msg.channel.guild.id : null,
				command: commands[0].command,
				args,
				successful: false
			}).run((error, result) => {
				if (error) return handleDatabaseError(error, msg);
				metrics.increment('commands.top', 1, [ 'command:' + commands[0].command ]);
				bot.statistics.commandUsage[commands[0].command] = (bot.statistics.commandUsage[commands[0].command] || 0) + 1;
				try {
					commands[0].execute(msg, args);
					r.table('commands').get(result.generated_keys[0]).update({
						successful: true
					}).run((error) => {
						if (error) handleDatabaseError(error);
					});
				} catch(e) {
					msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
					Logger.error('Failed to run command.', e);
				}
			});
		}
	});
};