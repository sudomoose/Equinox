const BaseCommand = require('../Structure/BaseCommand');
const formatDuration = require('../Util/formatDuration');

class Volume extends BaseCommand {
	constructor(bot, r, metrics) {
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
		this.metrics = metrics;
	}

	execute(msg) {
		if (!msg.channel.guild) return msg.channel.createMessage(':no_entry_sign:   **»**   You cannot use this command in a direct message.');
		if (!msg.member.voiceState.channelID) return msg.channel.createMessage(':no_entry_sign:   **»**   You must be in a voice channel in order to use this command.');
		if (!this.bot.voiceConnections.has(msg.channel.guild.id)) return msg.channel.createMessage(':no_entry_sign:   **»**   I am not playing any music within that channel.');
		if (this.bot.voiceConnections.get(msg.channel.guild.id).channelId !== msg.member.voiceState.channelID) return msg.channel.createMessage(':no_entry_sign:   **»**   I am already playing music within a different voice channel. Please join that channel instead.');
		if (!this.bot.queue.has(msg.channel.guild.id)) return msg.channel.createMessage(':exclamation:   **»**   I am not playing any music in that voice channel.');
		const queue = this.bot.queue.get(msg.channel.guild.id);
		msg.channel.createMessage({
			embed: {
				title: 'Now Playing',
				color: this.bot.embedColor,
				description: '[' + queue.nowPlaying.info.title + '](' + queue.nowPlaying.info.uri + ')',
				thumbnail: {
					url: 'https://img.youtube.com/vi/' + queue.nowPlaying.info.identifier + '/mqdefault.jpg'
				},
				fields: [
					{
						name: 'Author',
						value: queue.nowPlaying.info.author,
						inline: true
					},
					{
						name: 'Duration',
						value: formatDuration(queue.position) + '/' + formatDuration(queue.nowPlaying.info.length),
						inline: true
					}
				]
			}
		});
	}
}

module.exports = Volume;