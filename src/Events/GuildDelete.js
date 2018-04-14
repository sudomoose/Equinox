const WebhookClient = require('../Structure/WebhookClient');
let config;
let webhook;
if (!('TEST_TOKEN' in process.env)) {
	config = require('../config.json');
	webhook = new WebhookClient(config.webhooks.guilds.id, config.webhooks.guilds.token);
}

module.exports = (bot) => {
	bot.on('guildDelete', (guild) => {
		const owner = bot.users.get(guild.ownerID);
		webhook.send({
			title: 'Left a guild',
			color: 0xE50000,
			description: '**Name**: ' + guild.name + '\n**ID**: ' + guild.id + '\n**Members**: ' + guild.memberCount + '\n**Owner**: ' + owner.username + '#' + owner.discriminator
		});
	});
};