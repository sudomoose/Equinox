const BaseCommand = require('../Structure/BaseCommand');
const formatDuration = require('../Util/formatDuration');

class Volume extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'nowplaying',
			aliases: [
				'np'
			],
			description: 'Shows the song that is currently playing.',
			category: 'Music',
			usage: 'nowplaying',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg) {
		if (!msg.channel.guild) return msg.channel.createMessage(':no_entry_sign:   **»**   You cannot use this command in a direct message.');
		if (!msg.member.voiceState.channelID) return msg.channel.createMessage(':no_entry_sign:   **»**   You must be in a voice channel in order to use this command.');
		if (!this.bot.voiceConnections.has(msg.channel.guild.id)) return msg.channel.createMessage(':no_entry_sign:   **»**   I am not playing any music within that channel.');
		if (this.bot.voiceConnections.has(msg.channel.guild.id) && this.bot.voiceConnections.get(msg.channel.guild.id).channelId !== msg.member.voiceState.channelID) return msg.channel.createMessage(':no_entry_sign:   **»**   I am already playing music within a different voice channel. Please join that channel instead.');
		if (!(msg.channel.guild.id in this.bot.queue)) return msg.channel.createMessage(':exclamation:   **»**   I am not playing any music in that voice channel.');
		const queue = this.bot.queue[msg.channel.guild.id];
		const player = this.bot.voiceConnections.get(msg.channel.guild.id);
		msg.channel.createMessage({
			embed: {
				title: 'Now Playing',
				color: this.bot.embedColor,
				description: '[' + queue.queue[0].info.title + '](' + queue.queue[0].info.uri + ')',
				fields: [
					{
						name: 'Author',
						value: queue.queue[0].info.author,
						inline: true
					},
					{
						name: 'Duration',
						value: formatDuration(player.state.duration) + '/' + formatDuration(queue.queue[0].info.length),
						inline: true
					}
				]
			}
		});
	}
}

module.exports = Volume;