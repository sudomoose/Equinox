const BaseCommand = require('../Structure/BaseCommand');

class Raffle extends BaseCommand {
	constructor(bot, r, metrics) {
		super({
			command: 'raffle',
			aliases: [],
			description: 'Randomly selects a user from the server.',
			category: 'Utility',
			usage: 'raffle',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
	}

	execute(msg) {
		if (!msg.channel.guild) return msg.channel.createMessage(':no_entry_sign:   **»**   This command cannot be used in a direct message.');
		const member = Array.from(msg.channel.guild.members.values())[Math.floor(Math.random() * msg.channel.guild.members.size)];
		msg.channel.createMessage(':tickets:   **»**   `' + member.user.username + '#' + member.user.discriminator + ' (' + member.user.id + ')`');
	}
}

module.exports = Raffle;