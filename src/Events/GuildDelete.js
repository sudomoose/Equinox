const WebhookClient = require('../Structure/WebhookClient');
const updateGuildCount = require('../Util/updateGuildCount');
const config = require('../config.json');
const webhook = new WebhookClient(config.webhooks.guilds.id, config.webhooks.guilds.token);

module.exports = (bot) => {
	bot.on('guildDelete', (guild) => {
		const owner = bot.users.get(guild.ownerID);
		webhook.send({
			title: 'Left a guild',
			color: 0xE50000,
			description: '**Name**: ' + guild.name + '\n**ID**: ' + guild.id + '\n**Members**: ' + guild.memberCount + '\n**Owner**: ' + owner.username + '#' + owner.discriminator
		});
		updateGuildCount(bot);
	});
};