const WebhookClient = require('../Structure/WebhookClient');
const updateGuildCount = require('../Util/updateGuildCount');
const config = require('../config.json');
const webhook = new WebhookClient(config.webhooks.guilds.id, config.webhooks.guilds.token);

module.exports = (bot) => {
	bot.on('guildCreate', (guild) => {
		const owner = bot.users.get(guild.ownerID);
		webhook.send({
			title: 'Joined a guild',
			color: 306993,
			description: '**Name**: ' + guild.name + '\n**ID**: ' + guild.id + '\n**Members**: ' + guild.memberCount + '\n**Owner**: ' + owner.username + '#' + owner.discriminator
		});
		updateGuildCount(bot);
	});
};