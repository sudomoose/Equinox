const WebhookClient = require('../Structure/WebhookClient');
const updateGuildCount = require('../Util/updateGuildCount');
const handleDatabaseError = require('../Util/handleDatabaseError');
const config = require('../config.json');
const webhook = new WebhookClient(config.webhooks.guilds.id, config.webhooks.guilds.token);

module.exports = (bot, r) => {
	bot.on('guildCreate', (guild) => {
		const owner = bot.users.get(guild.ownerID);
		if (bot.user.id !== '336658909206937600') webhook.send({
			title: 'Joined a guild',
			color: 306993,
			description: '**Name**: ' + guild.name + '\n**ID**: ' + guild.id + '\n**Members**: ' + guild.memberCount + '\n**Owner**: ' + owner.username + '#' + owner.discriminator
		});
		updateGuildCount(bot);
	});
};