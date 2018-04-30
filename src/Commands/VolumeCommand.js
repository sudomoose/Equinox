const BaseCommand = require('../Structure/BaseCommand');
const config = require('../config.json');

class Volume extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'volume',
			aliases: [],
			description: 'See the volume or change the volume.',
			category: 'Music',
			usage: 'volume [volume]',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg, args) {
		if (!msg.channel.guild) return msg.channel.createMessage(':no_entry_sign:   **»**   You cannot use this command in a direct message.');
		if (!msg.member.voiceState.channelID) return msg.channel.createMessage(':no_entry_sign:   **»**   You must be in a voice channel in order to use this command.');
		if (this.bot.voiceConnections.has(msg.channel.guild.id) && this.bot.voiceConnections.get(msg.channel.guild.id).channelId !== msg.member.voiceState.channelID) return msg.channel.createMessage(':no_entry_sign:   **»**   I am already playing music within a different voice channel. Please join that channel instead.');
		if (!(msg.channel.guild.id in this.bot.queue)) return msg.channel.createMessage(':exclamation:   **»**   I am not playing any music in that voice channel.');
		const queue = this.bot.queue[msg.channel.guild.id];
		if (args.length > 0) {
			if (isNaN(args[0])) return msg.channel.createMessage(':exclamation:   **»**   The volume must be a valid number.');
			if (Number(args[0]) < 1) return msg.channel.createMessage(':exclamation:   **»**   The volume must be greater than or equal to 1.');
			if (Number(args[0]) > 150) return msg.channel.createMessage(':exclamation:   **»**   The volume must be less than or equal to 150.');
			queue.volume = Number(args[0]);
			this.bot.voiceConnections.get(msg.channel.guild.id).setVolume(queue.volume);
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