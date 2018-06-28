const BaseCommand = require('../Structure/BaseCommand');
const config = require('../config.json');

class Volume extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super({
			command: 'volume',
			aliases: [
				'set-volume',
				'setvolume',
				'vol'
			],
			description: 'See the volume or change the volume.',
			category: 'Music',
			usage: 'volume [<volume>]',
			hidden: false,
			guildOnly: true
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
		this.secondaryDB = secondaryDB;
	}

	execute(msg, args) {
		if (!msg.member.voiceState.channelID) return msg.channel.createMessage(':no_entry_sign:   **»**   You must be in a voice channel in order to use this command.');
		if (!this.bot.voiceConnections.has(msg.channel.guild.id)) return msg.channel.createMessage(':no_entry_sign:   **»**   I am not playing any music within that channel.');
		if (this.bot.voiceConnections.get(msg.channel.guild.id).channelId !== msg.member.voiceState.channelID) return msg.channel.createMessage(':no_entry_sign:   **»**   I am already playing music within a different voice channel. Please join that channel instead.');
		if (!this.bot.queue.has(msg.channel.guild.id)) return msg.channel.createMessage(':exclamation:   **»**   I am not playing any music in that voice channel.');
		const queue = this.bot.queue.get(msg.channel.guild.id);
		if (args.length > 0) {
			if (isNaN(args[0])) return msg.channel.createMessage(':exclamation:   **»**   The volume must be a valid number.');
			if (Number(args[0]) < 1) return msg.channel.createMessage(':exclamation:   **»**   The volume must be greater than or equal to 1.');
			if (Number(args[0]) > 150) return msg.channel.createMessage(':exclamation:   **»**   The volume must be less than or equal to 150.');
			queue.setVolume(Number(args[0]));
		}
		msg.channel.createMessage({
			embed: {
				title: 'Volume',
				color: this.bot.embedColor,
				description: '|' + (queue.volume >= 10 ? ('[' + Array(Math.floor(queue.volume / 10)).fill('─').join('') + '](' + config.links.server + ')') : '') + Array(Math.floor(15 - (queue.volume / 10))).fill('─').join('') + '| `' + queue.volume + '`'
			}
		});
	}
}

module.exports = Volume;