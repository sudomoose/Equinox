const BaseCommand = require('../Structure/BaseCommand');

class Raffle extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super({
			command: 'raffle',
			aliases: [],
			description: 'Randomly selects a user from the server.',
			category: 'Utility',
			usage: 'raffle',
			hidden: false,
			guildOnly: true
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
		this.secondaryDB = secondaryDB;
	}

	execute(msg) {
		const member = Array.from(msg.channel.guild.members.values())[Math.floor(Math.random() * msg.channel.guild.members.size)];
		msg.channel.createMessage(':tickets:   **»**   `' + member.user.username + '#' + member.user.discriminator + ' (' + member.user.id + ')`');
	}
}

module.exports = Raffle;