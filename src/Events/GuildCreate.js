const WebhookClient = require('../Structure/WebhookClient');
let config;
let webhook;
if (!('TEST_TOKEN' in process.env)) {
	config = require('../config.json');
	webhook = new WebhookClient(config.webhooks.guilds.id, config.webhooks.guilds.token);
}

module.exports = (bot) => {
	bot.on('guildCreate', (guild) => {
		const owner = bot.users.get(guild.ownerID);
		webhook.send({
			title: 'Joined a guild',
			color: 306993,
			description: '**Name**: ' + guild.name + '\n**ID**: ' + guild.id + '\n**Members**: ' + guild.memberCount + '\n**Owner**: ' + owner.username + '#' + owner.discriminator
		});
	});
};