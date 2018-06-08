const snekfetch = require('snekfetch');
const BaseCommand = require('../Structure/BaseCommand');
const config = require('../config.json');
const Logger = require('../Util/Logger');

class MinecraftServer extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'mc-server',
			aliases: [
				'mcserver',
				'minecraft-server',
				'minecraftserver'
			],
			description: 'Gets basic information about a Minecraft server from its IP address.',
			category: 'Information',
			usage: 'mcserver <IP address>[:<port>]',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a server IP address.');
		const host = args.join('').split(':')[0];
		const port = args.join('').split(':')[1] || '25565';
		if (isNaN(port)) return msg.channel.createMessage(':exclamation:   **»**   The port must be a valid number.');
		if (Number(port) > 65536) return msg.channel.createMessage(':exclamation:   **»**   The port must be less than or equal to 65536.');
		snekfetch.get('https://mcapi.us/server/status?ip=' + host + '&port=' + port).then((server) => {
			server = server.body;
			if (server.status === 'success') {
				const send = (favicon) => {
					const data = {
						title: host + ':' + port,
						description: server.motd.replace(/[ ]{2,}/g, ' '),
						color: this.bot.embedColor,
						fields: [
							{
								name: 'Players',
								value: server.players.now + '/' + server.players.max,
								inline: true
							},
							{
								name: 'Version',
								value: server.server.name,
								inline: true
							}
						]
					};
					if (favicon) data.thumbnail = { url: favicon };
					msg.channel.createMessage({
						embed: data
					});
				};
				if (server.favicon) {
					snekfetch.post('https://api.imgur.com/3/upload').set('Authorization', 'Client-ID '+ config.api_keys.imgur).send({
						title: 'Minecraft server favicon',
						image: server.favicon.replace('data:image/png;base64,', '')
					}).then((favicon) => {
						send(favicon.body.data.link);
					}).catch((error) => {
						msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
						Logger.error('Failed to upload favicon to Imgur', error);
					});
				} else {
					send();
				}
			} else {
				msg.channel.createMessage(':exclamation:   **»**   Unable to ping any servers by that IP address.');
			}
		}).catch((error) => {
			msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
			Logger.error('Failed to get server information', error);
		});
	}
}

module.exports = MinecraftServer;